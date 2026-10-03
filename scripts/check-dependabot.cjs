const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createRequire } = require('node:module');
const fromEslint = createRequire(require.resolve('eslint'));
const yaml = fromEslint('js-yaml');
const semver = fromEslint('semver');

const [snapshot, lockfile = 'pnpm-lock.yaml'] = process.argv.slice(2);
assert(snapshot, 'Usage: node scripts/check-dependabot.cjs alerts.json [lockfile]');
const alerts = JSON.parse(fs.readFileSync(snapshot, 'utf8'));
assert(Array.isArray(alerts) && alerts.length > 0, 'Expected a nonempty complete alert snapshot');
const lock = yaml.load(fs.readFileSync(lockfile, 'utf8'));
assert.equal(lock.lockfileVersion, '9.0');
const versions = new Map();
for (const key of Object.keys(lock.packages)) {
  const split = key.lastIndexOf('@');
  const name = key.slice(0, split);
  const version = key.slice(split + 1).split('(')[0];
  assert(semver.valid(version), `Unrecognized version: ${key}`);
  if (!versions.has(name)) versions.set(name, new Set());
  versions.get(name).add(version);
}
const results = alerts.map((alert) => {
  const name = alert.dependency.package.name;
  const range = alert.security_vulnerability.vulnerable_version_range;
  const normalized = range.replaceAll(',', ' ');
  assert(semver.validRange(normalized), `Unrecognized advisory range: ${range}`);
  const resolved = [...(versions.get(name) || [])];
  return {
    number: alert.number,
    package: name,
    manifest: alert.dependency.manifest_path,
    range,
    resolved,
    vulnerable: resolved.filter((version) => semver.satisfies(version, normalized, { includePrerelease: true })),
  };
});
const unresolved = results.filter((result) => result.vulnerable.length);
console.log(JSON.stringify({ captured: alerts.length, unresolved: unresolved.length, results }, null, 2));
process.exitCode = unresolved.length ? 1 : 0;
