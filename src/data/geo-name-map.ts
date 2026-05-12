/**
 * GeoJSON-to-World Bank country name mapping.
 *
 * Maps ECharts world.json feature names to World Bank country names
 * used in mind-scores.json. Required for correct choropleth rendering —
 * without this mapping, ~41 countries would appear as "no data" gray
 * despite having valid MIND scores.
 *
 * Verified against ECharts world.json (v5 built-in map) and
 * World Bank WDI country names from our dataset.
 */

/** 40-entry mapping from ECharts GeoJSON names to World Bank names. */
export const GEOJSON_NAME_MAP: Record<string, string> = {
  'Somalia': 'Somalia, Fed. Rep.',
  'Antigua and Barb.': 'Antigua and Barbuda',
  'Bahamas': 'Bahamas, The',
  'Bosnia and Herz.': 'Bosnia and Herzegovina',
  'Brunei': 'Brunei Darussalam',
  'Central African Rep.': 'Central African Republic',
  'Dem. Rep. Congo': 'Congo, Dem. Rep.',
  'Congo': 'Congo, Rep.',
  'Cape Verde': 'Cabo Verde',
  'Cayman Is.': 'Cayman Islands',
  'Czech Rep.': 'Czechia',
  'Dominican Rep.': 'Dominican Republic',
  'Egypt': 'Egypt, Arab Rep.',
  'Faeroe Is.': 'Faroe Islands',
  'Micronesia': 'Micronesia, Fed. Sts.',
  'Gambia': 'Gambia, The',
  'Eq. Guinea': 'Equatorial Guinea',
  'Iran': 'Iran, Islamic Rep.',
  'Kyrgyzstan': 'Kyrgyz Republic',
  'Korea': 'Korea, Rep.',
  'Saint Lucia': 'St. Lucia',
  'Macedonia': 'North Macedonia',
  'Dem. Rep. Korea': "Korea, Dem. People's Rep.",
  'Palestine': 'West Bank and Gaza',
  'Russia': 'Russian Federation',
  'S. Sudan': 'South Sudan',
  'Solomon Is.': 'Solomon Islands',
  'Slovakia': 'Slovak Republic',
  'Swaziland': 'Eswatini',
  'Syria': 'Syrian Arab Republic',
  'Turkey': 'Turkiye',
  'St. Vin. and Gren.': 'St. Vincent and the Grenadines',
  'Venezuela': 'Venezuela, RB',
  'Vietnam': 'Viet Nam',
  'Yemen': 'Yemen, Rep.',
  'Puerto Rico': 'Puerto Rico (US)',
  'U.S. Virgin Is.': 'Virgin Islands (U.S.)',
  'N. Mariana Is.': 'Northern Mariana Islands',
  'Fr. Polynesia': 'French Polynesia',
  'Turks and Caicos Is.': 'Turks and Caicos Islands',
};
