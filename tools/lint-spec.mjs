#!/usr/bin/env node
// Mechanical checks for R-24 and R-25 of the Governed Agentic Operating Model specification, plus
// cross-checks that fixtures/ and conformance/ have not drifted from it.
// Plain Node, ES module, no dependencies. Exits non-zero on any finding.

import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const specPath = resolve(root, "spec", "00-governed-agentic-operating-model.md");
const lines = readFileSync(specPath, "utf8").split("\n");

const findings = [];
const report = (id, what) => findings.push(`${id}: ${what}`);

const REQ_HEADING = /^\*\*R-(\d{2})\b/;
const FX_DEFINITION = /^\s*[-*]\s+\*\*FX-(\d{2})\b/;
const STRONG_KEYWORD = /\b(MUST NOT|MUST|SHALL|REQUIRED)\b/;
const METHODS = {
  strong: [/\bmachine-checked\b/, /\brecord\b/, /\battested\b/],
  weak: [/\bassessed\b/, /\bunenforceable\b/],
};

// 4. Duplicate identifiers, checked over the whole file.
const seen = new Map();
lines.forEach((line, i) => {
  const r = line.match(REQ_HEADING);
  const fx = line.match(FX_DEFINITION);
  const id = r ? `R-${r[1]}` : fx ? `FX-${fx[1]}` : null;
  if (!id) return;
  if (seen.has(id)) report(id, `defined again at line ${i + 1}; first defined at line ${seen.get(id)}`);
  else seen.set(id, i + 1);
});

// 5. Em dashes anywhere; en dashes used as a spaced dash.
lines.forEach((line, i) => {
  if (line.includes("—")) report(`line ${i + 1}`, "em dash (U+2014)");
  if (/ – /.test(line)) report(`line ${i + 1}`, "spaced en dash (U+2013)");
});

// Locate section 4 and split it into requirement blocks.
const start = lines.findIndex((l) => /^## 4\./.test(l));
if (start < 0) {
  report("spec", "section 4 heading not found");
} else {
  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end < 0) end = lines.length;

  const blocks = [];
  for (let i = start + 1; i < end; i++) {
    const m = lines[i].match(REQ_HEADING);
    if (!m) continue;
    let j = i + 1;
    while (j < end && !REQ_HEADING.test(lines[j]) && !/^#/.test(lines[j])) j++;
    blocks.push({ id: `R-${m[1]}`, lines: lines.slice(i, j) });
  }

  for (const { id, lines: body } of blocks) {
    const text = body.join("\n");
    const evidenceLine = body.find((l) => l.startsWith("Evidence:"));

    // 1. Every requirement carries an Evidence line.
    if (!evidenceLine) {
      report(id, "no line starting `Evidence:` before the next heading");
      continue;
    }

    // Methods are read from the Evidence segment only, up to the first `Reach:`.
    const segment = evidenceLine.split("Reach:")[0];
    const hasStrong = METHODS.strong.some((re) => re.test(segment));
    const hasWeak = METHODS.weak.some((re) => re.test(segment));
    if (!hasStrong && !hasWeak) report(id, "Evidence line names no method from the closed vocabulary");

    // 2. MUST, MUST NOT, SHALL and REQUIRED only where evidence unlocks them.
    if (!hasStrong && hasWeak) {
      const kw = text.match(STRONG_KEYWORD);
      if (kw) report(id, `uses ${kw[1]} but is evidenced only as assessed or unenforceable`);
    }

    // 3. Every machine-checked control declares reach and failure mode.
    if (/\bmachine-checked\b/.test(segment)) {
      if (!text.includes("Reach:")) report(id, "machine-checked but has no `Reach:`");
      if (!text.includes("If trusted further:")) report(id, "machine-checked but has no `If trusted further:`");
    }
  }
}

// 6. Every FX-nn defined in the spec has exactly one file in fixtures/, and
//    every fixture file names an FX-nn the spec defines, with a matching id field.
const specFx = new Set([...seen.keys()].filter((k) => k.startsWith("FX-")));
const specR = [...seen.keys()].filter((k) => k.startsWith("R-"));
const fixtureFiles = readdirSync(resolve(root, "fixtures")).filter((f) => /^FX-\d{2}-.*\.md$/.test(f));
const fileFx = new Map();
for (const f of fixtureFiles) {
  const id = f.match(/^(FX-\d{2})/)[1];
  if (fileFx.has(id)) report(id, `two fixture files: ${fileFx.get(id)} and ${f}`);
  fileFx.set(id, f);
  const body = readFileSync(resolve(root, "fixtures", f), "utf8");
  const idField = body.match(/^- `id`: (\S+)/m);
  if (!idField) report(id, `${f} has no id field`);
  else if (idField[1] !== id) report(id, `${f} declares id ${idField[1]}`);
  if (!specFx.has(id)) report(id, `${f} exists but the spec defines no ${id}`);
}
for (const id of specFx) if (!fileFx.has(id)) report(id, "defined in the spec but has no file in fixtures/");

// 7. The ICS template has one row per R-nn in the spec, and no others.
const ics = readFileSync(resolve(root, "conformance", "00-ics-template.md"), "utf8");
const rows = [...ics.matchAll(/^\| (R-\d{2}) \|/gm)].map((m) => m[1]);
for (const id of specR) if (!rows.includes(id)) report(id, "has no row in conformance/00-ics-template.md");
for (const id of rows) if (!seen.has(id)) report(id, "has a row in the ICS template but is not defined in the spec");
const dupRows = rows.filter((id, i) => rows.indexOf(id) !== i);
for (const id of new Set(dupRows)) report(id, "has more than one row in the ICS template");

if (findings.length) {
  for (const f of findings) console.log(f);
  process.exit(1);
}
console.log("spec lint: ok");
