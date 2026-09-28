const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
function load(file, overrides = {}, globals = {}) {
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(js, { module: loaded, exports: loaded.exports, require: name => overrides[name] ?? require(name), console, process, ...globals });
  return loaded.exports;
}
const scoring = load('lib/clarity-check.ts');
const answers = score => scoring.clarityQuestions.map(q => ({ id: q.id, category: q.category, score }));
test('all 21 answers normalize to 0, 25, 50, 75 and 100', () => {
  for (let value = 1; value <= 5; value++) {
    const result = scoring.systemsScore(scoring.calculateClarityResult(answers(value)));
    assert.equal(result.overall, (value - 1) * 25);
    for (const score of Object.values(result.categories)) assert.equal(score, result.overall);
  }
});
test('overall weights all 21 questions equally, categories normalize independently', () => {
  const mixed = answers(1).map(a => ({ ...a, score: a.category === 'visibility' ? 5 : 1 }));
  const result = scoring.systemsScore(scoring.calculateClarityResult(mixed));
  assert.equal(result.overall, 29);
  assert.equal(result.categories.visibility, 100);
  assert.equal(result.strongest, 'visibility');
  assert.equal(result.lowest, 'capture');
});
test('bands include every boundary', () => {
  for (const [score, band] of [[0,'FOUNDATION'],[39,'FOUNDATION'],[40,'PATCHED TOGETHER'],[59,'PATCHED TOGETHER'],[60,'CONNECTED'],[79,'CONNECTED'],[80,'BUILT TO SCALE'],[100,'BUILT TO SCALE']]) assert.equal(scoring.systemsBand(score), band);
});
test('historical array and current object payloads remain readable', () => {
  for (const payload of [answers(3), { scored: answers(3) }]) assert.equal(scoring.assessmentDisplay({ answers: payload, total_score: 63, result_band: 'WORKAROUNDS' }).overall, 50);
  const legacy = scoring.assessmentDisplay({ answers: [], total_score: 32, result_band: 'GROWING FRICTION' });
  assert.equal(legacy.max, 50); assert.equal(legacy.overall, 32); assert.equal(legacy.categories, null);
});
function routeHarness({ emailFail = false, saveFail = false, existing = false } = {}) {
  const writes = [], emails = [], notifications = [];
  const db = { from(table) {
    const query = {
      select() { return query; }, eq() { return query; }, order() { return query; }, limit() { return query; },
      maybeSingle: async () => ({ data: existing ? { id: 'existing-lead' } : null, error: null }),
      insert(payload) { writes.push({ table, payload }); return query; },
      update(payload) { writes.push({ table, payload }); return query; },
      single: async () => ({ data: saveFail && table === 'clarity_assessments' ? null : { id: table === 'leads' ? 'lead-1' : 'assessment-1' }, error: saveFail && table === 'clarity_assessments' ? { message: 'unavailable' } : null }),
    }; return query;
  } };
  const route = load('app/api/clarity-check/route.ts', {
    '../../../lib/clarity-check': scoring,
    'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } },
    '../../../lib/supabase/server': { getSupabaseServerClient: () => db },
    '../../../lib/lead-notifications': { sendLeadNotification: async input => { notifications.push(input); return { attempted: true, accepted: true }; }, logLeadNotificationFailure: async () => {} },
  }, { process: { env: { RESEND_API_KEY: 'fake-test-key' } }, console: { ...console, error() {} }, fetch: async (_, input) => { emails.push(JSON.parse(input.body)); return { ok: !emailFail, text: async () => 'test failure' }; } });
  return { route, writes, emails, notifications };
}
test('API rejects duplicate/missing answers, invalid scores, malformed payloads and email before writing', async () => {
  const h = routeHarness();
  for (const payload of [null, { firstName:'A', email:'invalid', answers:answers(3) }, { firstName:'A', email:'a@example.com', answers:answers(3).slice(1) }, { firstName:'A', email:'a@example.com', answers:answers(6) }, { firstName:'A', email:'a@example.com', answers:answers(3).map(() => answers(3)[0]) }]) {
    assert.equal((await h.route.POST({ json: async () => payload })).status, 400);
  }
  assert.equal(h.writes.length, 0);
});
test('save links the lead, preserves raw scores and consent, stores normalized results and sends diagnostic email', async () => {
  const h = routeHarness({ existing: true });
  const response = await h.route.POST({ json: async () => ({ firstName:'<Lauren>', email:'TEST@example.com', answers:answers(3), consent:false }) });
  assert.equal(response.status, 200); assert.equal(response.body.emailSent, true);
  const saved = h.writes.find(w => w.table === 'clarity_assessments' && w.payload.answers).payload;
  assert.equal(saved.total_score, 63); assert.equal(saved.answers.systems_score.overall, 50);
  assert.equal(saved.answers.consent, false); assert.equal(saved.lead_id, 'lead-1');
  assert.equal(h.emails[0].subject, 'Your Mosaic Systems Score: 50/100');
  assert.match(h.emails[0].html, /&lt;Lauren&gt;/);
  assert.match(h.emails[0].html, /Capture: 50\/100/);
  assert.match(h.emails[0].html, /JxAn6pJFxwyu1FJq6/);
  assert.doesNotMatch(h.emails[0].html, /Recommended starting point|Explore Services/);
  assert.equal(h.notifications.length, 1);
});
test('email delivery failure still unlocks saved results; assessment failure does not send email', async () => {
  const h = routeHarness({ emailFail: true });
  const payload = { firstName:'A', email:'test@example.com', answers:answers(3) };
  const response = await h.route.POST({ json: async () => payload });
  assert.equal(response.body.success, true); assert.equal(response.body.emailSent, false);
  const failed = routeHarness({ saveFail: true });
  assert.equal((await failed.route.POST({ json: async () => payload })).status, 500);
  assert.equal(failed.emails.length, 0);
});
