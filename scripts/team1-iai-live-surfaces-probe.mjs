#!/usr/bin/env node
/**
 * Probe *.iai.one surfaces from iai-live-surfaces-qa-registry.md
 * Usage: node scripts/team1-iai-live-surfaces-probe.mjs
 */
const DOMAINS = [
  "https://iai.one",
  "https://trust.iai.one",
  "https://pay.iai.one",
  "https://app.iai.one",
  "https://flow.iai.one",
  "https://dash.iai.one",
  "https://docs.iai.one",
  "https://developer.iai.one",
  "https://api.iai.one",
  "https://nft.iai.one",
  "https://cios.iai.one",
  "https://noos.iai.one",
  "https://life.iai.one",
  "https://api.flow.iai.one/v1/flow/meta",
  "https://api.flow.iai.one/health",
  "https://mail.iai.one",
  "https://web.iai.one",
  "https://cdn.iai.one",
  "https://flows.iai.one",
];

const CIOS_PATHS = [
  "https://cios-workers-api.tranhatam.workers.dev/v1/meta",
  "https://cios-workers-api.tranhatam.workers.dev/v1/system/health",
];

async function probe(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });
    return { url, status: res.status, ok: res.ok };
  } catch (err) {
    return { url, status: "ERR", ok: false, error: String(err.message || err) };
  }
}

async function main() {
  const all = [...DOMAINS, ...CIOS_PATHS];
  const results = await Promise.all(all.map(probe));
  let pass = 0;
  let fail = 0;
  for (const r of results) {
    const mark = r.ok ? "OK" : "FAIL";
    if (r.ok) pass++;
    else fail++;
    console.log(`${mark}\t${r.status}\t${r.url}`);
  }
  console.log(`\n${pass} pass / ${fail} fail / ${results.length} total`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
