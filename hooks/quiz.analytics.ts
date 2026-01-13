export type WeeklyProgressPoint = {
  week: number;
  progress: number;
};

export type WeightProgressPoint = {
  label: string;
  weight: number;
};

/**
 * Motivação ID 7 — progresso relativo
 */
export function getRelativeWeeklyProgress(): WeeklyProgressPoint[] {
  return [
    { week: 1, progress: 25 },
    { week: 2, progress: 45 },
    { week: 3, progress: 70 },
    { week: 4, progress: 90 },
  ];
}

/**
 * Motivação ID 13 — evolução esperada do peso
 */
export function getExpectedWeightProgress(
  currentWeight: number,
  targetWeight: number
): WeightProgressPoint[] {
  const diff = currentWeight - targetWeight;

  return [
    {
      label: "3 dias",
      weight: currentWeight - diff * 0.1,
    },
    {
      label: "7 dias",
      weight: currentWeight - diff * 0.25,
    },
    {
      label: "30 dias",
      weight: currentWeight - diff * 0.45,
    },
  ];
}
