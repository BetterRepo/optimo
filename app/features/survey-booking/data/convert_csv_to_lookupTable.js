// Node.js script to convert csv_lookup_data.csv to lookupTable.ts format
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const csvFile = path.join(path.dirname(new URL(import.meta.url).pathname), 'csv_lookup_data.csv');
const outputFile = path.join(path.dirname(new URL(import.meta.url).pathname), 'lookupTable.ts');

// Helper to normalize zip codes
function normalizeZip(zip) {
  if (!zip) return '';
  // Remove any non-numeric characters but keep leading zeros
  return zip.replace(/[^0-9]/g, '');
}

// Helper to clean warehouse name
function cleanWarehouseName(warehouse) {
  if (!warehouse) return '';
  // Just remove leading/trailing whitespace, keep the state
  return warehouse.trim();
}

// Read and process the CSV file
const data = fs.readFileSync(csvFile, 'utf8');
const records = parse(data, {
  columns: true,
  skip_empty_lines: true
});

console.log(`Total records in CSV: ${records.length}`);

const result = [];
const seenZips = new Set(); // To track unique zip codes
let skippedCount = 0;

for (const record of records) {
  const zip = normalizeZip(record.ZIP_CODE);
  const warehouse = cleanWarehouseName(record.Warehouse);
  
  // Only add if we have both zip and warehouse, and haven't seen this zip before
  if (zip && warehouse && !seenZips.has(zip)) {
    seenZips.add(zip);
    result.push({ zip, warehouse });
  } else {
    skippedCount++;
  }
}

console.log(`Found ${result.length} unique zip codes`);
console.log(`Skipped ${skippedCount} entries`);

// Sort by zip code (descending)
result.sort((a, b) => b.zip.localeCompare(a.zip));

// Create the output content
const output = [
  '// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.',
  'export const lookupTable = [',
  ...result.map(({ zip, warehouse }) => `  { zip: "${zip}", warehouse: "${warehouse}" },`),
  '];',
  ''
].join('\n');

// Write to lookupTable.ts
fs.writeFileSync(outputFile, output, 'utf8');
console.log(`lookupTable.ts generated successfully with ${result.length} entries!`); 