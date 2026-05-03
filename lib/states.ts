// ISO 3166-2:MY → Malaysian state name
// Vercel sets x-vercel-ip-country-region as the second part of the ISO code (e.g. "10")
export const MY_STATES: Record<string, string> = {
  "01": "Johor",
  "02": "Kedah",
  "03": "Kelantan",
  "04": "Melaka",
  "05": "Negeri Sembilan",
  "06": "Pahang",
  "07": "Pulau Pinang",
  "08": "Perak",
  "09": "Perlis",
  "10": "Selangor",
  "11": "Terengganu",
  "12": "Sabah",
  "13": "Sarawak",
  "14": "Wilayah Persekutuan Kuala Lumpur",
  "15": "Wilayah Persekutuan Labuan",
  "16": "Wilayah Persekutuan Putrajaya",
  // Some IP providers return JHR / KUL / SGR style codes — alias them
  JHR: "Johor",
  KDH: "Kedah",
  KTN: "Kelantan",
  MLK: "Melaka",
  NSN: "Negeri Sembilan",
  PHG: "Pahang",
  PNG: "Pulau Pinang",
  PRK: "Perak",
  PLS: "Perlis",
  SGR: "Selangor",
  TRG: "Terengganu",
  SBH: "Sabah",
  SWK: "Sarawak",
  KUL: "Wilayah Persekutuan Kuala Lumpur",
  LBN: "Wilayah Persekutuan Labuan",
  PJY: "Wilayah Persekutuan Putrajaya",
};

export function resolveMyState(regionCode: string | null | undefined): string | null {
  if (!regionCode) return null;
  return MY_STATES[regionCode.toUpperCase()] ?? null;
}
