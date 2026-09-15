import { describe, it, expect } from 'vitest';
import { toCsv } from '../../src/app/shared/utils/csv';

describe('toCsv', () => {
  it('returns empty for empty input', () => {
    expect(toCsv([])).toBe('');
  });

  it('converts rows to CSV with escaping', () => {
    const rows = [{ name: 'Alice', note: 'He said "hi"' }];
    const csv = toCsv(rows);
    expect(csv).toContain('name,note');
    expect(csv).toContain('"He said ""hi"""');
  });
});
