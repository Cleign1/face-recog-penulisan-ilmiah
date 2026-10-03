const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Docker base supplies OpenSSL before Prisma generation in every stage', () => {
  const dockerfile = fs.readFileSync(path.join(__dirname, '..', 'Dockerfile'), 'utf8');
  const base = dockerfile.split('FROM base AS deps')[0];
  assert.match(base, /RUN apk add --no-cache openssl/, 'Prisma must detect OpenSSL 3 and the runner must retain its libraries');
});

test('Docker dependency stage includes package patches before frozen installation', () => {
  const dockerfile = fs.readFileSync(path.join(__dirname, '..', 'Dockerfile'), 'utf8');
  const install = dockerfile.indexOf('pnpm i --frozen-lockfile');
  const patches = dockerfile.indexOf('COPY patches ./patches');
  assert(patches !== -1 && patches < install, 'pnpm requires the declared TensorFlow patch during installation');
});
