const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const vm = require("node:vm");

function load(file, overrides = {}) {
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(js, { module: loaded, exports: loaded.exports, require: (name) => overrides[name] ?? require(name), console, process, crypto: require("crypto"), fetch: (...args) => global.fetch(...args) });
  return loaded.exports;
}

const scoring = load("lib/systems-score-v2.ts");
const siteLinks = load("lib/site-links.ts");
const access = load("lib/systems-score-access.ts", { "./site-links": siteLinks });
const fixes = load("lib/systems-score-fixes.ts");
const notifications = load("lib/lead-notifications.ts");
const emailLib = load("lib/systems-score-email.ts", {
  "./site-links": siteLinks,
  "./systems-score-access": access,
  "./systems-score-v2": scoring,
});

function storedSample(name = "Ada") {
  const stored = scoring.buildStoredSystemsScore({
    submissionId: "11111111-1111-4111-8111-111111111111",
    answers: Array(12).fill(1),
    adminHours: 7.5,
    clientValue: 1000,
  });
  return { stored, name };
}

test("report email keeps the ivory and olive Systems Score design and the private links", () => {
  const { stored } = storedSample();
  const message = emailLib.buildSystemsScoreReportEmail(stored, "Ada <script>", "token-value-token-value-token-value-token");
  assert.equal(message.subject, `Your Mosaic Systems Score: ${stored.overall}/100`);
  assert.equal(message.from, "Mosaic <reports@buildwithmosaic.co>");
  assert.match(message.html, /#f4f0e9/);
  assert.match(message.html, /#f8f7f3/);
  assert.match(message.html, /#555b44/);
  assert.match(message.html, new RegExp(`${stored.overall}/100`));
  assert.match(message.html, /Running on You/);
  assert.match(message.html, /Capture: 0\/25/);
  assert.match(message.html, /Follow-Up: 0\/25/);
  assert.match(message.html, /Connection: 0\/25/);
  assert.match(message.html, /Visibility: 0\/25/);
  assert.match(message.html, /Memory-Based Follow-Up/);
  assert.match(message.html, /\/systems-score\/r#token-value-token-value-token-value-token\/memory-based-follow-up/);
  assert.match(message.html, /calendar\.app\.google\/RL8WWoW6Td5tdUbV9/);
  assert.match(message.html, /Ada &lt;script&gt;/);
  assert.doesNotMatch(message.html, /video/i);
  assert.equal(emailLib.systemsScoreFollowUpEmailsEnabled, false);
});

test("email links stay on /systems-score/r and do not become case-study paths", () => {
  const token = "a".repeat(43);
  const leaks = ["memory-based-follow-up", "slow-first-response", "scattered-inquiries"];
  const saved = new URL(access.resultsLink(token));
  assert.equal(saved.origin, "https://buildwithmosaic.co");
  assert.equal(saved.pathname, "/systems-score/r");
  assert.equal(saved.search, "");
  assert.equal(saved.hash, `#${token}`);
  const paths = new Set([saved.pathname]);
  const fragments = [];
  for (const leakId of leaks) {
    const link = new URL(access.resultsLink(token, leakId));
    assert.equal(link.origin, "https://buildwithmosaic.co");
    assert.equal(link.pathname, "/systems-score/r");
    assert.equal(link.search, "");
    assert.equal(link.hash, `#${token}/${leakId}`);
    assert.equal(access.parseResultsHash(link.hash).leakId, leakId);
    paths.add(link.pathname);
    fragments.push(link.hash);
  }
  assert.equal(paths.size, 1);
  assert.equal(new Set(fragments).size, 3);
  assert.equal(siteLinks.isReservedPublicPath(["systems-score", "r"]), true);
  assert.equal(siteLinks.isReservedPublicPath(["work", "white-poppy-preservation"]), false);
  assert.equal(siteLinks.SYSTEMS_SCORE_RESULTS_PATH, "/systems-score/r");
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000/";
  try {
    assert.equal(new URL(access.resultsLink(token)).origin, "http://localhost:3000");
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previous;
  }
  const catchAll = fs.readFileSync("app/[...slug]/page.tsx", "utf8");
  const guardAt = catchAll.indexOf("isReservedPublicPath(slug)");
  const caseStudyAt = catchAll.indexOf("getCaseStudy(slug)");
  assert.equal(guardAt > -1 && caseStudyAt > guardAt, true);
});

test("access tokens are hashed, scoped, and rejected when the shape is wrong", () => {
  const token = access.createAccessToken();
  assert.match(token, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(access.hashAccessToken(token), require("crypto").createHash("sha256").update(token).digest("hex"));
  assert.equal(access.hashAccessToken(token) === token, false);
  const parsed = access.parseResultsHash(`#${token}/memory-based-follow-up`);
  assert.equal(parsed.token, token);
  assert.equal(parsed.leakId, "memory-based-follow-up");
  assert.equal(access.parseResultsHash("#short"), null);
  assert.equal(access.resultsLink(token, "slow-first-response").includes(`#${token}/slow-first-response`), true);
});

test("email plan does not send twice and treats a disabled flag as different from a failure", () => {
  assert.equal(scoring.emailDeliveryPlan(null, false), "disabled");
  assert.equal(scoring.emailDeliveryPlan(null, true), "send");
  assert.equal(scoring.emailDeliveryPlan("2026-10-09T00:00:00.000Z", true), "already_sent");
});

test("written fixes stay out of the public scoring module and only return the three leaks", () => {
  const scoringSource = fs.readFileSync("lib/systems-score-v2.ts", "utf8");
  const quizSource = fs.readFileSync("app/systems-score/SystemsScoreQuiz.tsx", "utf8");
  assert.equal(scoringSource.includes("Pick one front door."), false);
  assert.equal(quizSource.includes("Pick one front door."), false);
  assert.equal(fs.readFileSync("app/layout.tsx", "utf8").includes("window.location.href.split('#')[0]"), true);
  const chosen = fixes.fixesForLeaks(["slow-first-response", "scattered-inquiries"]);
  assert.deepEqual(chosen.map((fix) => fix.id), ["slow-first-response", "scattered-inquiries"]);
  assert.equal(chosen[0].steps.length, 4);
  assert.equal(fixes.fixesForLeaks(["not-a-leak"]).length, 0);
});

function routeDb(seed = []) {
  const assessments = seed.map((row) => ({ ...row }));
  const writes = [];
  const supabase = {
    from(table) {
      const filters = {};
      const query = {
        select() { return query; },
        eq(column, value) { filters[column] = value; return query; },
        is() { return query; },
        order() { return query; },
        limit() { return query; },
        insert(payload) { writes.push({ table, op: "insert", payload }); query.payload = payload; return query; },
        update(payload) { writes.push({ table, op: "update", payload }); query.payload = payload; return query; },
        maybeSingle: async () => {
          if (table === "clarity_assessments") {
            const row = assessments.find((item) => item.submission_id === filters.submission_id) ?? null;
            return { data: row, error: null };
          }
          if (table === "leads") return { data: null, error: null };
          if (table === "systems_score_access_tokens") {
            return { data: filters.token_hash === "known-hash" ? { id: "token-1", revoked_at: null, assessment_id: "assessment-1" } : null, error: null };
          }
          return { data: null, error: null };
        },
        single: async () => {
          if (table === "clarity_assessments" && query.payload?.submission_id) {
            assessments.push({ ...query.payload, id: "assessment-1", email_sent_at: null, lead_id: "lead-1" });
          }
          const id = table === "leads" ? "lead-1" : table === "clarity_assessments" ? "assessment-1" : "token-1";
          return { data: { id }, error: null };
        },
      };
      return query;
    },
  };
  return { supabase, writes, assessments };
}

function loadRoute(supabase) {
  return load("app/api/systems-score/route.ts", {
    "next/server": { NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200, headers: init?.headers }) } },
    "../../../lib/systems-score-access": access,
    "../../../lib/systems-score-email": emailLib,
    "../../../lib/systems-score-fixes": fixes,
    "../../../lib/lead-notifications": notifications,
    "../../../lib/supabase/server": { getSupabaseServerClient: () => supabase },
    "../../../lib/systems-score-v2": scoring,
  });
}

const validBody = {
  submissionId: "11111111-1111-4111-8111-111111111111",
  firstName: "Ada",
  email: "ada@example.com",
  answers: Array(12).fill(1),
  adminHours: 7.5,
  clientValue: null,
};

test("a disabled report keeps the fixes, writes one assessment, and does not call Resend", async () => {
  const previousFlag = process.env.SYSTEMS_SCORE_V2_EMAIL_ENABLED;
  const previousKey = process.env.RESEND_API_KEY;
  delete process.env.SYSTEMS_SCORE_V2_EMAIL_ENABLED;
  delete process.env.RESEND_API_KEY;
  const calls = [];
  const originalFetch = global.fetch;
  global.fetch = async () => { calls.push("fetch"); return { ok: true, text: async () => "", json: async () => ({}) }; };
  try {
    const db = routeDb();
    const route = loadRoute(db.supabase);
    const first = await route.POST({ json: async () => validBody });
    const second = await route.POST({ json: async () => validBody });
    assert.equal(first.status, 200);
    assert.equal(first.body.emailSent, false);
    assert.equal(first.body.emailStatus, "disabled");
    assert.equal(first.body.fixes.length, 3);
    assert.equal(JSON.stringify(first.body).includes("/systems-score/r#"), false);
    assert.equal(second.body.emailStatus, "disabled");
    assert.equal(db.writes.filter((write) => write.table === "clarity_assessments" && write.op === "insert").length, 1);
    assert.equal(calls.length, 0);
  } finally {
    global.fetch = originalFetch;
    if (previousFlag === undefined) delete process.env.SYSTEMS_SCORE_V2_EMAIL_ENABLED;
    else process.env.SYSTEMS_SCORE_V2_EMAIL_ENABLED = previousFlag;
    if (previousKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousKey;
  }
});

test("a failed send leaves the fixes available and a retry does not create another assessment", async () => {
  const previousFlag = process.env.SYSTEMS_SCORE_V2_EMAIL_ENABLED;
  const previousKey = process.env.RESEND_API_KEY;
  process.env.SYSTEMS_SCORE_V2_EMAIL_ENABLED = "true";
  process.env.RESEND_API_KEY = "test-key";
  let fail = true;
  const sent = [];
  const originalFetch = global.fetch;
  global.fetch = async (_url, init) => {
    const body = JSON.parse(init.body);
    sent.push(body);
    if (body.to?.[0] === "ada@example.com" && fail) return { ok: false, text: async () => "provider down", json: async () => ({}) };
    return { ok: true, text: async () => "", json: async () => ({ id: "email-1" }) };
  };
  try {
    const db = routeDb();
    const route = loadRoute(db.supabase);
    const failed = await route.POST({ json: async () => validBody });
    assert.equal(failed.body.emailSent, false);
    assert.equal(failed.body.emailStatus, "failed");
    assert.equal(failed.body.fixes.length, 3);
    assert.equal(db.writes.filter((write) => write.table === "clarity_assessments" && write.op === "insert").length, 1);
    assert.equal(sent.filter((message) => message.to?.[0] === "ada@example.com").length, 1);
    fail = false;
    const retried = await route.POST({ json: async () => validBody });
    assert.equal(retried.body.emailStatus, "sent");
    assert.equal(db.writes.filter((write) => write.table === "clarity_assessments" && write.op === "insert").length, 1);
    assert.equal(sent.filter((message) => message.to?.[0] === "ada@example.com").length, 2);
    db.assessments[0].email_sent_at = "2026-10-09T00:00:00.000Z";
    const already = await route.POST({ json: async () => validBody });
    assert.equal(already.body.emailSent, true);
    assert.equal(already.body.emailStatus, "sent");
    assert.equal(sent.filter((message) => message.to?.[0] === "ada@example.com").length, 2);
    assert.equal(db.writes.filter((write) => write.table === "clarity_assessments" && write.op === "insert").length, 1);
  } finally {
    global.fetch = originalFetch;
    if (previousFlag === undefined) delete process.env.SYSTEMS_SCORE_V2_EMAIL_ENABLED;
    else process.env.SYSTEMS_SCORE_V2_EMAIL_ENABLED = previousFlag;
    if (previousKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousKey;
  }
});

test("invalid Systems Score submissions do not write anything", async () => {
  const db = routeDb();
  const route = loadRoute(db.supabase);
  const response = await route.POST({ json: async () => ({ ...validBody, email: "not-an-email", answers: [1] }) });
  assert.equal(response.status, 400);
  assert.equal(db.writes.length, 0);
});

test("a saved private link returns only that assessment's fixes and a revoked link does not", async () => {
  const stored = scoring.buildStoredSystemsScore({
    submissionId: "11111111-1111-4111-8111-111111111111",
    answers: Array(12).fill(2),
    adminHours: 3.5,
    clientValue: null,
  });
  const token = access.createAccessToken();
  const revoked = access.createAccessToken();
  const tokens = [
    { id: "active", token_hash: access.hashAccessToken(token), revoked_at: null, assessment_id: "assessment-1" },
    { id: "revoked", token_hash: access.hashAccessToken(revoked), revoked_at: "2026-10-09T00:00:00.000Z", assessment_id: "assessment-1" },
  ];
  const supabase = {
    from(table) {
      const filters = {};
      const query = {
        select() { return query; },
        eq(column, value) { filters[column] = value; return query; },
        update() { return query; },
        maybeSingle: async () => {
          if (table === "systems_score_access_tokens") {
            const row = tokens.find((item) => item.token_hash === filters.token_hash) ?? null;
            return { data: row, error: null };
          }
          if (table === "clarity_assessments") {
            return { data: { first_name: "Ada", answers: { version: 2, systemsScoreV2: stored } }, error: null };
          }
          return { data: null, error: null };
        },
      };
      return query;
    },
  };
  const route = load("app/api/systems-score/access/route.ts", {
    "next/server": { NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) } },
    "../../../../lib/systems-score-access": access,
    "../../../../lib/systems-score-fixes": fixes,
    "../../../../lib/supabase/server": { getSupabaseServerClient: () => supabase },
    "../../../../lib/systems-score-v2": scoring,
  });
  const opened = await route.POST({ json: async () => ({ token }) });
  assert.equal(opened.status, 200);
  assert.equal(opened.body.firstName, "Ada");
  assert.equal(opened.body.fixes.length, 3);
  assert.equal(JSON.stringify(opened.body).includes(token), false);
  assert.equal(opened.body.email, undefined);
  const closed = await route.POST({ json: async () => ({ token: revoked }) });
  assert.equal(closed.status, 404);
  const missing = await route.POST({ json: async () => ({ token: "nope" }) });
  assert.equal(missing.status, 404);
});
