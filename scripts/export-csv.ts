import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const data = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'src', 'data', 'mind-scores.json'), 'utf-8'));

const indicatorCodes = Object.keys(data.indicators);
const header = [
  'ISO3', 'Country', 'Region', 'Income_Level',
  'M_Score', 'I_Score', 'N_Score', 'D_Score', 'MIND_Score', 'Binding_Constraint',
  ...indicatorCodes
];

const rows: string[] = [header.join(',')];

for (const [iso3, country] of Object.entries(data.countries) as any) {
  const m = country.dimensions.m?.score ?? 0;
  const i = country.dimensions.i?.score ?? 0;
  const n = country.dimensions.n?.score ?? 0;
  const d = country.dimensions.d?.score ?? 0;

  const mind = Math.pow((m / 100) * (i / 100) * (n / 100) * (d / 100), 0.25) * 100;

  const dims: Record<string, number> = { m, i, n, d };
  const bc = Object.entries(dims).sort((a, b) => a[1] - b[1])[0][0].toUpperCase();

  // Build indicator lookup: code -> raw value
  const indicatorValues: Record<string, any> = {};
  for (const dim of Object.values(country.dimensions) as any) {
    if (dim.indicators) {
      for (const ind of dim.indicators) {
        indicatorValues[ind.code] = ind.raw;
      }
    }
  }

  const csvEscape = (s: string) => s.includes(',') ? `"${s}"` : s;

  const row = [
    iso3,
    csvEscape(country.name),
    csvEscape(country.region?.trim() ?? ''),
    csvEscape(country.incomeLevel ?? ''),
    m.toFixed(2),
    i.toFixed(2),
    n.toFixed(2),
    d.toFixed(2),
    mind.toFixed(2),
    bc,
    ...indicatorCodes.map(code => indicatorValues[code] != null ? indicatorValues[code] : '')
  ];

  rows.push(row.join(','));
}

const outPath = join(import.meta.dirname, '..', 'public', 'mind-scores-217.csv');
writeFileSync(outPath, rows.join('\n'), 'utf-8');
console.log(`Wrote ${rows.length - 1} countries to ${outPath}`);
