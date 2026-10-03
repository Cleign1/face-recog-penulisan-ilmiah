const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs/promises');
const http = require('node:http');
const { once } = require('node:events');
const os = require('node:os');
const path = require('node:path');
const { createRequire } = require('node:module');
const fromTensorflow = createRequire(require.resolve('@tensorflow/tfjs-node'));
const tar = fromTensorflow('tar');
const resources = fromTensorflow('../scripts/resources.js');

test('TensorFlow downloader extracts in-directory library symlink chains with patched tar', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'face-tensorflow-test-'));
  const server = http.createServer();
  const proxies = ['HTTPS_PROXY', 'https_proxy', 'HTTP_PROXY', 'http_proxy'];
  const saved = proxies.map((name) => process.env[name]);
  try {
    for (const name of proxies) delete process.env[name];
    await fs.mkdir(path.join(directory, 'lib'));
    await fs.mkdir(path.join(directory, 'output'));
    await fs.writeFile(path.join(directory, 'lib/libtensorflow.so.2.7.0'), 'native-library-fixture');
    await fs.symlink('libtensorflow.so.2.7.0', path.join(directory, 'lib/libtensorflow.so.2'));
    await fs.symlink('libtensorflow.so.2', path.join(directory, 'lib/libtensorflow.so'));
    const archive = path.join(directory, 'fixture.tar.gz');
    await tar.c({ cwd: directory, file: archive, gzip: true }, [
      './lib/libtensorflow.so.2.7.0', './lib/libtensorflow.so.2', './lib/libtensorflow.so',
    ]);
    const body = await fs.readFile(archive);
    server.on('request', (_request, response) => {
      response.writeHead(200, { 'content-length': body.length });
      response.end(body);
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Downloader did not complete')), 5000);
      resources.downloadAndUnpackResource(`http://127.0.0.1:${server.address().port}/fixture.tar.gz`, path.join(directory, 'output'), () => {
        clearTimeout(timeout);
        resolve();
      }).catch(reject);
    });
    assert.equal(await fs.readFile(path.join(directory, 'output/lib/libtensorflow.so'), 'utf8'), 'native-library-fixture');
    assert.equal(await fs.readlink(path.join(directory, 'output/lib/libtensorflow.so')), 'libtensorflow.so.2.7.0');
  } finally {
    server.close();
    await fs.rm(directory, { recursive: true, force: true });
    proxies.forEach((name, index) => saved[index] === undefined ? delete process.env[name] : process.env[name] = saved[index]);
  }
});

test('patched tar still refuses archive links escaping the destination', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'face-tar-security-test-'));
  try {
    await fs.mkdir(path.join(directory, 'source'));
    await fs.mkdir(path.join(directory, 'output'));
    await fs.symlink('../../outside', path.join(directory, 'source/escape'));
    const archive = path.join(directory, 'escape.tar');
    await tar.c({ cwd: path.join(directory, 'source'), file: archive }, ['escape']);
    await assert.rejects(tar.x({ cwd: path.join(directory, 'output'), file: archive, strict: true }), /outside|escape|symlink/i);
    await assert.rejects(fs.lstat(path.join(directory, 'output/escape')), { code: 'ENOENT' });
  } finally { await fs.rm(directory, { recursive: true, force: true }); }
});
