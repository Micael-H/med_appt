// Run against the local lab API and its configured disposable test records.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const path = require('node:path');
const { createRequire } = require('node:module');
const serverRequire = createRequire(path.join(__dirname, '../server/package.json'));
serverRequire('dotenv').config({ path: path.join(__dirname, '../server/.env') });
const mongoose = serverRequire('mongoose');

const base = 'http://127.0.0.1:8181/api/auth';
const runId = crypto.randomUUID();
const password = crypto.randomBytes(24).toString('hex');
const users = ['a', 'b'].map((suffix) => ({
  email: `smoke-${runId}-${suffix}@example.invalid`,
  name: `Smoke User ${suffix.toUpperCase()}`,
  phone: '2025550100',
  password,
}));
const createdIds = new Map();

async function request(route, options = {}) {
  const response = await fetch(`${base}${route}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json();
  return { response, data };
}
function expectStatus(result, expected, label) {
  assert.equal(result.response.status, expected, label);
}
function expect(condition, label) {
  // Assertions contain descriptions only, never credential values or responses.
  assert.ok(condition, label);
}

async function main() {
  expect(Boolean(process.env.MONGODB_URI), 'MONGODB_URI must be configured');
  const allowedOrigin = process.env.CLIENT_ORIGIN?.split(',')[0].trim();
  expect(Boolean(allowedOrigin), 'CLIENT_ORIGIN must be configured');
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'stayhealthybeta1', serverSelectionTimeoutMS: 10000,
  });
  const collection = mongoose.connection.collection('users');
  try {
    const tokens = [];
    for (const user of users) {
      const registered = await request('/register', { method: 'POST', body: JSON.stringify(user) });
      expectStatus(registered, 200, 'Registration succeeds');
      expect(typeof registered.data.authtoken === 'string', 'Registration returns a token');
      const record = await collection.findOne({ email: user.email });
      expect(Boolean(record), 'Registered record exists in the configured database');
      createdIds.set(user.email, record._id);
      const login = await request('/login', { method: 'POST', body: JSON.stringify({
        email: user.email, password: user.password,
      }) });
      expectStatus(login, 200, 'Valid login succeeds');
      expect(typeof login.data.authtoken === 'string', 'Login returns a token');
      tokens.push(login.data.authtoken);
    }

    expectStatus(await request('/login', { method: 'POST', body: JSON.stringify({
      email: users[0].email, password: 'intentionally-incorrect-password',
    }) }), 403, 'Incorrect password is rejected');
    expectStatus(await request('/user'), 401, 'Profile requires authentication');
    expectStatus(await request('/user', { headers: { 'auth-token': 'invalid.token.value' } }),
      401, 'Invalid JWT is rejected');

    const profileA = await request('/user', { headers: {
      'auth-token': tokens[0], email: users[1].email,
    } });
    expectStatus(profileA, 200, 'Authenticated profile succeeds');
    expect(profileA.data.email === users[0].email, 'Email header cannot select another profile');
    expect(profileA.data.password === undefined, 'Profile excludes password hash');

    const update = await request('/user', { method: 'PUT', headers: {
      Authorization: `Bearer ${tokens[0]}`, email: users[1].email,
    }, body: JSON.stringify({ name: 'Smoke Updated A', phone: '2025550101' }) });
    expectStatus(update, 200, 'Authenticated profile update succeeds');
    const afterA = await request('/user', { headers: { Authorization: `Bearer ${tokens[0]}` } });
    const afterB = await request('/user', { headers: { 'auth-token': tokens[1] } });
    expectStatus(afterA, 200, 'Updated profile can be read');
    expectStatus(afterB, 200, 'Second profile can be read');
    expect(afterA.data.name === 'Smoke Updated A' && afterA.data.phone === '2025550101',
      'Update changes authenticated user A');
    expect(afterB.data.name === users[1].name && afterB.data.phone === users[1].phone,
      'Update does not change user B');

    const legacyUpdate = await request('/update', { method: 'PUT', headers: {
      'auth-token': tokens[0], email: users[1].email,
    }, body: JSON.stringify({ name: 'Smoke Legacy Updated A' }) });
    expectStatus(legacyUpdate, 200, 'Legacy update endpoint accepts authenticated user');
    const legacyA = await request('/user', { headers: { 'auth-token': tokens[0] } });
    const legacyB = await request('/user', { headers: { 'auth-token': tokens[1] } });
    expect(legacyA.data.name === 'Smoke Legacy Updated A', 'Legacy update changes user A');
    expect(legacyB.data.name === users[1].name, 'Legacy update cannot change user B');

    const allowed = await request('/user', { headers: { Origin: allowedOrigin } });
    expect(allowed.response.headers.get('access-control-allow-origin') === allowedOrigin,
      'Configured origin receives CORS permission');
    const deniedOrigin = `https://smoke-${runId}.example.invalid`;
    const denied = await request('/user', { headers: { Origin: deniedOrigin } });
    expect(!denied.response.headers.get('access-control-allow-origin'),
      'Unconfigured origin receives no CORS permission');
    console.log('PASS: registration, login, profile authorization, update isolation and CORS.');
  } finally {
    // The random emails belong exclusively to this run. Also catch records whose
    // registration succeeded before a later assertion or network failure.
    const cleanup = await Promise.allSettled(users.map(async (user) => {
      const id = createdIds.get(user.email);
      await collection.deleteOne(id ? { _id: id, email: user.email } : { email: user.email });
    }));
    expect(cleanup.every((result) => result.status === 'fulfilled'), 'Test record cleanup succeeds');
  }
}

main().catch(() => {
  // Never print database errors, request objects, tokens or passwords.
  console.error('FAIL: API smoke test. Verify the local API, database and expected behaviors.');
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect();
});
