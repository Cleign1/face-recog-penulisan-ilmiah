const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

for (const page of ['app/siswa/presensi/page.js', 'app/siswa/presensi/daftar/page.js']) {
  test(`${page} keeps browser-only face recognition behind a client boundary`, () => {
    const source = fs.readFileSync(path.join(__dirname, '..', page), 'utf8');
    assert.match(source, /^['"]use client['"];/, 'Next 15 requires a Client Component for ssr: false');
    assert.match(source, /ssr:\s*false/, 'Camera components must not run on the server');
  });
}
