const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const nameLogic = script.slice(0, script.indexOf("const state = {"));
const shareStart = script.indexOf("function buildShareMessage() {");
const shareEnd = script.indexOf("\nasync function copyShareMessage(", shareStart);
const shareLogic = script.slice(shareStart, shareEnd);

function previewFor(search) {
  const context = {
    URLSearchParams,
    window: { location: { search } },
    state: {
      date: "2026-10-10",
      time: "17:00",
      food: { emoji: "🍕", label: "Pizza" },
      chaos: { emoji: "😌", label: "A little spontaneous" },
    },
    formatDate: () => "Saturday, October 10, 2026",
    formatTime: () => "5:00 PM",
  };
  vm.runInNewContext(`${nameLogic}\n${shareLogic}\nglobalThis.preview = {
    name: inviteeName,
    intro: withInviteeName(CONFIG.messages.introTitle),
    question: personalizedName ? withInviteeName(CONFIG.messages.questionTitlePersonalized) : CONFIG.messages.questionTitle,
    final: personalizedName ? withInviteeName(CONFIG.messages.finalTitlePersonalized) : CONFIG.messages.finalTitle,
    share: buildShareMessage(),
  };`, context);
  return context.preview;
}

test("each link displays its own name and includes it in the shared plan", () => {
  for (const name of ["Chosen Name", "Another Choice", "Renée"]) {
    const preview = previewFor(`?name=${encodeURIComponent(name)}`);
    assert.equal(preview.intro, `Hey, ${name}... 👀`);
    assert.equal(preview.question, `${name}, will you go on a date with me? 💐`);
    assert.equal(preview.final, `IT'S A DATE, ${name.toUpperCase()}! 🥹💗`);
    assert.match(preview.share, new RegExp(name.toUpperCase()));
    assert.match(preview.share, /Pizza/);
    assert.match(preview.share, /A little spontaneous/);
  }
});

test("URL-encoded names are decoded once", () => {
  assert.equal(previewFor("?name=First%20Last").name, "First Last");
  assert.equal(previewFor("?name=First+Last").intro, "Hey, First Last... 👀");
});

test("missing, blank, and placeholder values fall back safely", () => {
  for (const search of ["", "?name=", "?name=%20%20", "?name=null", "?name=undefined"]) {
    const preview = previewFor(search);
    assert.equal(preview.intro, "Hey, you... 👀");
    assert.equal(preview.question, "Will you go on a date with me? 💐");
    assert.equal(preview.final, "IT'S A DATE 🥹💗");
  }
});

test("the intro is added without renumbering the seven original pages", () => {
  const pages = [...html.matchAll(/<section class="page[^"]*" data-page="(\d+)"/g)].map((match) => Number(match[1]));
  assert.deepEqual(pages, [0, 1, 2, 3, 4, 5, 6, 7]);
  assert.match(html, /class="page active intro-page" data-page="0"/);
  assert.match(html, /class="page question-page" data-page="1"[^>]* hidden>/);
  assert.equal([...html.matchAll(/class="progress-dot/g)].length, 8);
});
