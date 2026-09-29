import { describe, expect, it } from 'vitest';
import { bestScore, controversialScore } from '../lib/score';
describe('forum scoring', () => {
  it('decays older posts', () => expect(bestScore(100, 1)).toBeGreaterThan(bestScore(100, 24)));
  it('favors balanced high-volume voting', () => expect(controversialScore(50, 50)).toBeGreaterThan(controversialScore(10, 0)));
});
