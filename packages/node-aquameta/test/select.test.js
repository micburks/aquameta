
import {withTableFixture} from './fixture.js';

test('select', async () => {
  await withTableFixture(async fixtureName => {
    const rel = meta.relation(fixtureName);
    const rows = await meta.selectTable(rel);
    expect(rows.length).toBe(2);
  });
});
