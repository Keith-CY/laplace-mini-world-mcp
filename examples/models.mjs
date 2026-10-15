// Search the public catalog of Laplace's Mini World (world.lapla.si) from Node 18+.
// Usage: node examples/models.mjs <words> [zh|en]
const [query = '', lang = 'en'] = process.argv.slice(2);
const res = await fetch('https://world.lapla.si/models.json');
if (!res.ok) throw new Error(`models.json: HTTP ${res.status}`);
const catalog = await res.json();

const words = query.toLowerCase().split(/\s+/).filter(Boolean);
const text = (p) => [p.slug, p.title.zh, p.title.en, p.kicker.zh, p.kicker.en, p.summary.zh, p.summary.en]
  .join(' ').toLowerCase();
const hits = catalog.plates.filter((p) => words.every((w) => text(p).includes(w)));

console.log(`${hits.length} of ${catalog.count} plates`);
for (const p of hits) {
  console.log(`\n${p.plate}  ${p.title[lang]}  (${p.hall.name[lang]})`);
  console.log(`   ${p.summary[lang]}`);
  console.log(`   plate:    ${p.url[lang]}`);
  console.log(`   embed:    ${p.embed[lang]}`);
  console.log(`   chapters: ${p.chapters.map((c) => c.id).join(', ')}`);
  if (p.params?.length) console.log(`   lab:      ${p.params.map((s) => `${s.id} (${s.kind})`).join(', ')}`);
}
