/**
 * Genere supabase/migrations/0002_seed_from_dataset.sql a partir du dataset
 * historique (PLACES / TRANSPORT_EDGES), pour peupler Supabase avec les donnees
 * deja collectees dans la version vanilla JS d'IvoireMap.
 *
 * Usage : node scripts/generate-seed-sql.js > supabase/migrations/0002_seed_from_dataset.sql
 */
const path = require("path");

// Charge data.js tel quel dans un contexte sandbox minimal (il s'attend a definir `window`)
const vm = require("vm");
const fs = require("fs");

const dataSrc = fs.readFileSync(path.join(__dirname, "..", "..", "ivoiremap", "ivoiremap", "js", "data.js"), "utf-8");
const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(dataSrc, sandbox);

const { PLACES, EDGES } = sandbox.window.IvoireData;

function sqlStr(v) {
  if (v === null || v === undefined) return "null";
  return "'" + String(v).replace(/'/g, "''") + "'";
}

function sqlArray(arr) {
  if (!arr || arr.length === 0) return "'{}'";
  return "ARRAY[" + arr.map((a) => sqlStr(a)).join(", ") + "]::text[]";
}

let out = "-- Seed genere automatiquement depuis l'ancien js/data.js (ne pas editer a la main)\n\n";

out += "insert into places (id, name, aliases, commune, category, category_name, lat, lng, popular_description, landmark, status)\nvalues\n";
out += PLACES.map((p) => {
  return `  (${sqlStr(p.id)}, ${sqlStr(p.name)}, ${sqlArray(p.aliases)}, ${sqlStr(p.commune)}, ${sqlStr(p.category)}, ${sqlStr(
    p.categoryName
  )}, ${p.lat}, ${p.lng}, ${sqlStr(p.popularDescription)}, ${sqlStr(p.landmark)}, 'actif')`;
}).join(",\n");
out += "\non conflict (id) do nothing;\n\n";

out += "insert into transport_edges (id, from_place, to_place, bidirectional, mode, duration_minutes, price_fcfa, line, instructions)\nvalues\n";
out += EDGES.map((e) => {
  return `  (${sqlStr(e.id)}, ${sqlStr(e.from)}, ${sqlStr(e.to)}, ${e.bidirectional ? "true" : "false"}, ${sqlStr(
    e.mode
  )}, ${e.duration}, ${e.price}, ${sqlStr(e.line)}, ${sqlStr(e.instructions)})`;
}).join(",\n");
out += "\non conflict (id) do nothing;\n";

process.stdout.write(out);
