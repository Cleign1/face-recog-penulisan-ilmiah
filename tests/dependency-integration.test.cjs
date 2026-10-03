const assert = require('node:assert/strict');
const test = require('node:test');
const { PrismaClient } = require('@prisma/client');
const { compare } = require('bcryptjs');

const base = process.env.FACE_TEST_BASE_URL;
const database = process.env.FACE_TEST_DATABASE_URL;
assert(base && database, 'Set FACE_TEST_BASE_URL and FACE_TEST_DATABASE_URL for the disposable integration environment');
assert.equal(new URL(base).hostname, '127.0.0.1');
const url = new URL(database);
assert.equal(url.hostname, '127.0.0.1');
assert.equal(url.pathname, '/face_test');

test('populated baseline records survive dependency updates without a schema migration', async () => {
  const db = new PrismaClient({ datasources: { db: { url: database } } });
  try {
    const user = await db.user.findUnique({ where: { username: 'security-baseline' }, include: { dataSiswa: { include: { faceData: true, presensi: true } } } });
    assert(user);
    assert.equal(user.role, 'siswa');
    assert(await compare('disposable-test-password', user.password));
    assert.deepEqual(user.dataSiswa.faceData.faceDescriptor, [0.1, 0.2]);
    assert.equal(user.dataSiswa.presensi.length, 1);
    const response = await fetch(`${base}/api/siswa/data?npm=${user.npm}`);
    assert.equal(response.status, 200);
    const result = await response.json();
    assert(JSON.stringify(result).includes('Dependency test'));
  } finally { await db.$disconnect(); }
});

test('actual credentials provider authenticates the persisted baseline user', async () => {
  const csrfResponse = await fetch(`${base}/api/auth/csrf`);
  assert.equal(csrfResponse.status, 200);
  const { csrfToken } = await csrfResponse.json();
  const csrfCookies = csrfResponse.headers.getSetCookie().map((cookie) => cookie.split(';')[0]).join('; ');
  const login = await fetch(`${base}/api/auth/callback/credentials`, {
    method: 'POST', redirect: 'manual', headers: { cookie: csrfCookies, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ csrfToken, username: 'security-baseline', password: 'disposable-test-password', callbackUrl: base, json: 'true' }),
  });
  assert([200, 302].includes(login.status));
  const cookies = login.headers.getSetCookie().map((cookie) => cookie.split(';')[0]);
  assert(cookies.some((cookie) => cookie.startsWith('next-auth.session-token=')), 'Credentials login must create a session token');
  const sessionResponse = await fetch(`${base}/api/auth/session`, { headers: { cookie: cookies.join('; ') } });
  assert.equal(sessionResponse.status, 200);
  const session = await sessionResponse.json();
  assert.equal(session.user.username, 'security-baseline');
  assert.equal(session.user.role, 'siswa');
  assert.equal(session.user.npm, 'security-test-1');
});

test('production pages and auth provider routes remain available', async () => {
  for (const route of ['/', '/login', '/daftar', '/api/auth/providers']) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200, route);
  }
  const response = await fetch(`${base}/api/auth/providers`);
  assert.equal((await response.json()).credentials.type, 'credentials');
});
