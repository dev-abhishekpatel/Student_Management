export function toCsv(rows: Record<string, any>[]): string {
  if (!rows || rows.length === 0) return '';
  const header = Object.keys(rows[0]).join(',');
  const data = rows.map(r => Object.values(r).map(v => '"' + (v ?? '').toString().replace(/"/g, '""') + '"').join(',')).join('\n');
  return header + '\n' + data;
}
