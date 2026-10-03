const assert = require('node:assert/strict');
const test = require('node:test');
const { createRequire } = require('node:module');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

test('sharp processes an image and uuid generates upload identifiers', async () => {
  const sharp = require('sharp');
  const { v4, validate } = require('uuid');
  const image = await sharp({ create: { width: 2, height: 2, channels: 3, background: '#ffffff' } }).jpeg().toBuffer();
  assert.equal((await sharp(image).metadata()).format, 'jpeg');
  assert(validate(v4()));
});

test('NextAuth round-trips role-bearing JWT sessions', async () => {
  const { encode, decode } = require('next-auth/jwt');
  const secret = 'disposable-offline-test-secret';
  const token = await encode({ token: { sub: '1', role: 'siswa', npm: 'test-1' }, secret });
  const decoded = await decode({ token, secret });
  assert.equal(decoded.role, 'siswa');
  assert.equal(decoded.npm, 'test-1');
  assert.equal(await decode({ token: `${token}invalid`, secret }).catch(() => null), null);
});

test('TensorFlow installer dependencies unpack archives using their consuming resolution', async () => {
  const fromTensorflow = createRequire(require.resolve('@tensorflow/tfjs-node'));
  const tar = fromTensorflow('tar');
  const AdmZip = fromTensorflow('adm-zip');
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'face-archive-test-'));
  try {
    await fs.mkdir(path.join(directory, 'unpacked'));
    await fs.writeFile(path.join(directory, 'fixture.txt'), 'archive fixture');
    await tar.c({ cwd: directory, file: path.join(directory, 'fixture.tar') }, ['fixture.txt']);
    await tar.x({ cwd: path.join(directory, 'unpacked'), file: path.join(directory, 'fixture.tar') });
    assert.equal(await fs.readFile(path.join(directory, 'unpacked/fixture.txt'), 'utf8'), 'archive fixture');
    const zip = new AdmZip();
    zip.addFile('fixture.txt', Buffer.from('zip fixture'));
    const restored = new AdmZip(zip.toBuffer());
    assert.equal(restored.readAsText('fixture.txt'), 'zip fixture');
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('S3 serializes and signs an upload without contacting production storage', async () => {
  const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
  let request;
  const client = new S3Client({
    region: 'auto', endpoint: 'https://storage.example.test',
    credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
    requestHandler: { handle: async (input) => {
      request = input;
      return { response: { statusCode: 200, headers: {}, body: Buffer.alloc(0) } };
    } },
  });
  try {
    await client.send(new PutObjectCommand({ Bucket: 'test', Key: 'face.jpg', Body: Buffer.from('fixture') }));
    assert.match(request.headers.authorization, /^AWS4-HMAC-SHA256/);
    assert.match(request.path, /face\.jpg$/);
  } finally { client.destroy(); }
});
