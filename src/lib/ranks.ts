const RANKS = [
  { name: "bronze", threshold: 0, labelEn: "Bronze", labelAr: "برونز" },
  { name: "silver", threshold: 50, labelEn: "Silver", labelAr: "فضي" },
  { name: "gold", threshold: 200, labelEn: "Gold", labelAr: "ذهبي" },
  { name: "platinum", threshold: 500, labelEn: "Platinum", labelAr: "بلاتين" },
  { name: "diamond", threshold: 1000, labelEn: "Diamond", labelAr: "ماسي" },
];

export function calculateRank(points: number): string {
  let rank = "bronze";
  for (const r of RANKS) {
    if (points >= r.threshold) rank = r.name;
  }
  return rank;
}

export function getNextRank(points: number): { name: string; pointsNeeded: number } | null {
  for (const r of RANKS) {
    if (points < r.threshold) return { name: r.name, pointsNeeded: r.threshold - points };
  }
  return null;
}

export function getRankLabel(rank: string): string {
  return RANKS.find((r) => r.name === rank)?.labelEn ?? rank;
}

export function getRankLabelAr(rank: string): string {
  return RANKS.find((r) => r.name === rank)?.labelAr ?? rank;
}

const POINTS = {
  LIKE_ON_POST: 5,
  LIKE_ON_PROJECT: 5,
  LIKE_ON_THREAD: 3,
  LIKE_ON_COMMENT: 10,
};

export function getPointsForEntity(entityType: string, isComment: boolean): number {
  if (isComment) return POINTS.LIKE_ON_COMMENT;
  if (entityType === "post") return POINTS.LIKE_ON_POST;
  if (entityType === "project") return POINTS.LIKE_ON_PROJECT;
  if (entityType === "thread") return POINTS.LIKE_ON_THREAD;
  return 0;
}
