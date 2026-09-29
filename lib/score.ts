export function bestScore(score: number, ageHours: number) { return score / Math.pow(ageHours + 2, 1.4); }
export function controversialScore(upvotes: number, downvotes: number) { const total = upvotes + downvotes; if (!total) return 0; return total * (1 - Math.abs(upvotes - downvotes) / total); }
