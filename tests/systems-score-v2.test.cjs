const { test } = require("node:test");
const assert = require("node:assert/strict");
const ts = require("typescript");
const fs = require("node:fs");
const vm = require("node:vm");

function load(file) {
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(js, { module: loaded, exports: loaded.exports, require, console, process, Intl });
  return loaded.exports;
}

function same(actual, expected) {
  assert.equal(JSON.stringify(actual), JSON.stringify(expected));
}

const score = load("lib/systems-score-v2.ts");

function answers(values) {
  return values.length === 12 ? values : Array(12).fill(values);
}

test("section scores match the published raw-point table", () => {
  const table = [0, 3, 6, 8, 11, 14, 17, 19, 22, 25];
  table.forEach((expected, index) => assert.equal(score.sectionScore(index + 3), expected));
});

test("overall score is the sum of rounded section scores", () => {
  const result = score.scoreSystemsScore({
    answers: [4, 4, 4, 1, 1, 1, 4, 1, 1, 2, 2, 2],
    adminHours: 7.5,
    clientValue: null,
  });
  assert.equal(result.sections.capture.score, 25);
  assert.equal(result.sections.follow_up.score, 0);
  assert.equal(result.sections.connection.score, 8);
  assert.equal(result.sections.visibility.score, 8);
  assert.equal(result.overall, 41);
});

test("tier names follow the published boundaries", () => {
  const cases = [
    [0, "Running on You"],
    [39, "Running on You"],
    [40, "Patched Together"],
    [64, "Patched Together"],
    [65, "Mostly Connected"],
    [84, "Mostly Connected"],
    [85, "Running Like a System"],
    [100, "Running Like a System"],
  ];
  for (const [value, name] of cases) assert.equal(score.tierFor(value).name, name);
});

test("constructed quizzes land on tier edges that the section table can reach", () => {
  const quiz = (values, expectedScore, expectedTier) => {
    const result = score.scoreSystemsScore({ answers: values, adminHours: 3.5, clientValue: null });
    assert.equal(result.overall, expectedScore);
    assert.equal(result.tierName, expectedTier);
  };
  quiz(answers(1), 0, "Running on You");
  quiz([4, 2, 2, 4, 2, 2, 2, 2, 3, 1, 1, 1], 39, "Running on You");
  quiz([4, 4, 4, 4, 4, 1, 4, 2, 2, 2, 2, 2], 64, "Patched Together");
  quiz([4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3], 84, "Mostly Connected");
  quiz([4, 4, 4, 4, 4, 3, 4, 3, 3, 4, 3, 3], 85, "Running Like a System");
  quiz(answers(4), 100, "Running Like a System");
});

test("section bar labels use 0–10, 11–18, and 19–25", () => {
  assert.equal(score.sectionStatus(0), "Leaking");
  assert.equal(score.sectionStatus(10), "Leaking");
  assert.equal(score.sectionStatus(11), "Shaky");
  assert.equal(score.sectionStatus(18), "Shaky");
  assert.equal(score.sectionStatus(19), "Solid");
  assert.equal(score.sectionStatus(25), "Solid");
  const reachable = { 0: "Leaking", 3: "Leaking", 6: "Leaking", 8: "Leaking", 11: "Shaky", 14: "Shaky", 17: "Shaky", 19: "Solid", 22: "Solid", 25: "Solid" };
  for (const [value, label] of Object.entries(reachable)) assert.equal(score.sectionStatus(Number(value)), label);
});

test("two-question leaks use the lower answer", () => {
  const result = score.scoreSystemsScore({
    answers: [4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 2, 4],
    adminHours: 1.5,
    clientValue: null,
  });
  const names = result.leaks.map((leak) => `${leak.name}:${leak.score}:${leak.kind}`);
  same(names.slice(0, 2), ["Memory-Based Follow-Up:1:leak", "Blind Spot Reporting:2:leak"]);
});

test("equal leak scores break ties by time lost, and a worse score outranks priority", () => {
  const tied = score.rankLeaks(answers(2)).map((leak) => leak.name);
  same(tied, ["Memory-Based Follow-Up", "Slow First Response", "Scattered Inquiries"]);
  const worseScoreWins = score.rankLeaks([4, 4, 1, 3, 3, 4, 4, 4, 4, 4, 4, 4]).map((leak) => leak.name);
  assert.equal(worseScoreWins[0], "Unknown Lead Sources");
  assert.equal(worseScoreWins[1], "Memory-Based Follow-Up");
});

test("fewer than three true leaks are filled with tune-ups in tie-break order", () => {
  const partial = score.rankLeaks([1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
  same(partial.map((leak) => [leak.name, leak.kind]), [
    ["Slow First Response", "leak"],
    ["Scattered Inquiries", "leak"],
    ["Memory-Based Follow-Up", "tune-up"],
  ]);
  const tuneUps = score.rankLeaks(answers(4));
  same(tuneUps.map((leak) => [leak.name, leak.kind]), [
    ["Memory-Based Follow-Up", "tune-up"],
    ["Slow First Response", "tune-up"],
    ["Scattered Inquiries", "tune-up"],
  ]);
});

test("weakest section uses the lowest score, then Follow-Up, Capture, Connection, Visibility", () => {
  const tied = score.scoreSystemsScore({ answers: answers(1).map((answer, index) => index < 6 ? 1 : 4), adminHours: 3.5, clientValue: null });
  assert.equal(tied.sections.capture.score, 0);
  assert.equal(tied.sections.follow_up.score, 0);
  assert.equal(tied.weakestSection, "follow_up");

  const captureLower = score.scoreSystemsScore({ answers: [1, 1, 1, 4, 4, 4, 2, 2, 2, 4, 4, 4], adminHours: 3.5, clientValue: null });
  assert.ok(captureLower.sections.capture.score < captureLower.sections.follow_up.score);
  assert.equal(captureLower.weakestSection, "capture");

  const connectionTie = score.scoreSystemsScore({ answers: [4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1], adminHours: 3.5, clientValue: null });
  assert.equal(connectionTie.sections.connection.score, connectionTie.sections.visibility.score);
  assert.equal(connectionTie.weakestSection, "connection");
});

test("hours use the published example, half-hour rounding, and the one-hour floor", () => {
  same(score.estimateHours(7.5, 46, true), { hoursLost: 4, hoursLostMonth: 16 });
  same(score.estimateHours(7.5, 83, true), { hoursLost: 1.5, hoursLostMonth: 6 });
  same(score.estimateHours(1.5, 70, false), { hoursLost: 0.5, hoursLostMonth: 2 });
  same(score.estimateHours(1.5, 70, true), { hoursLost: 1, hoursLostMonth: 4 });
  same(score.estimateHours(1.5, 97, true), { hoursLost: 1, hoursLostMonth: 4 });
  same(score.estimateHours(20, 100, false), { hoursLost: 0, hoursLostMonth: 0 });

  const nearPerfect = score.scoreSystemsScore({
    answers: [4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    adminHours: 1.5,
    clientValue: null,
  });
  assert.equal(nearPerfect.overall, 97);
  assert.equal(nearPerfect.hasTrueLeak, true);
  assert.equal(nearPerfect.hoursLost, 1);
  assert.equal(nearPerfect.hoursLostMonth, 4);

  const solid = score.scoreSystemsScore({ answers: answers(4), adminHours: 15, clientValue: null });
  assert.equal(solid.hasTrueLeak, false);
  assert.equal(solid.hoursLost, 0);
  assert.equal(solid.hoursLostMonth, 0);
});

test("client-value risk is optional and is four times the selected midpoint", () => {
  const hidden = score.scoreSystemsScore({ answers: answers(2), adminHours: 7.5, clientValue: null });
  assert.equal(hidden.clientValue, null);
  assert.equal(hidden.yearlyRisk, null);

  const shown = score.scoreSystemsScore({ answers: answers(2), adminHours: 7.5, clientValue: 1000 });
  assert.equal(shown.clientValue, 1000);
  assert.equal(shown.yearlyRisk, 4000);
  assert.equal(score.formatDollars(shown.yearlyRisk), "$4,000");
  for (const option of score.clientValueOptions) {
    if (option.value === null) continue;
    const result = score.scoreSystemsScore({ answers: answers(3), adminHours: 3.5, clientValue: option.value });
    assert.equal(result.yearlyRisk, option.value * 4);
  }
});

test("answer choice order is worth 1 through 4 and pain values stay off the labels", () => {
  assert.equal(score.scoredQuestions.length, 12);
  assert.equal(score.adminHourOptions.length, 5);
  assert.equal(score.clientValueOptions.length, 6);
  for (const question of score.scoredQuestions) {
    assert.equal(question.options.length, 4);
    assert.equal(question.options.some((option) => /\[\d\]/.test(option)), false);
  }
  same(score.adminHourOptions.map((option) => option.value), [1.5, 3.5, 7.5, 15, 20]);
  assert.equal(score.clientValueOptions.at(-1).value, null);
});
