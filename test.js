// Run: node test.js   (checks domain parsing, allowlist matching and rule files)
const assert = require("assert");
const fs = require("fs");
const { normalizeDomain, isAllowlisted } = require("./common.js");

assert.equal(normalizeDomain("Example.com"), "example.com");
assert.equal(normalizeDomain("https://www.example.com:8080/a?b"), "example.com");
assert.equal(normalizeDomain("*.news.example.co.uk"), "news.example.co.uk");
assert.equal(normalizeDomain("localhost"), null);
assert.equal(normalizeDomain("bad domain.com"), null);
assert.equal(normalizeDomain(""), null);

assert.ok(isAllowlisted("example.com", ["example.com"]));
assert.ok(isAllowlisted("m.example.com", ["example.com"]));
assert.ok(!isAllowlisted("notexample.com", ["example.com"]));

for (const file of ["rules/ad-rules.json", "rules/video-ad-rules.json", "rules/popup-ad-rules.json"]) {
  const rules = JSON.parse(fs.readFileSync(file, "utf8"));
  const ids = rules.map(r => r.id);
  assert.equal(new Set(ids).size, ids.length, `duplicate rule id in ${file}`);
}
JSON.parse(fs.readFileSync("manifest.json", "utf8"));

console.log("ok");
