export function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let current = '';
  let inQuotes = false;
  const row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((ch === '\n' || (ch === '\r' && next === '\n')) && !inQuotes) {
      if (ch === '\r') i++;
      row.push(current.trim());
      if (row.some(c => c !== '')) lines.push(row);
      current = '';
      row.length = 0;
    } else if (ch === '\r' && next !== '\n' && !inQuotes) {
      row.push(current.trim());
      if (row.some(c => c !== '')) lines.push(row);
      current = '';
      row.length = 0;
    } else {
      current += ch;
    }
  }
  if (current.trim() || row.length > 0) {
    row.push(current.trim());
    if (row.some(c => c !== '')) lines.push(row);
  }
  return lines;
}

export function csvToObjects<T extends Record<string, string>>(csvText: string): T[] {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.toLowerCase().replace(/[^a-z0-9]+/g, ''));
  const result: T[] = [];
  for (let i = 1; i < rows.length; i++) {
    const obj: Record<string, string> = {};
    rows[i].forEach((val, idx) => {
      if (idx < headers.length) {
        obj[headers[idx]] = val;
      }
    });
    if (Object.keys(obj).length > 0) result.push(obj as T);
  }
  return result;
}

export function downloadTemplate(filename: string, headers: string[], rows: string[][]) {
  const escape = (v: string) => (v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v);
  const lines = [headers.map(escape).join(',')];
  for (const row of rows) {
    lines.push(row.map(escape).join(','));
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
