import { mockEntries } from "./mockData";

export interface FitnessResult {
  fitnessLevel: "Excellent" | "Good" | "Average" | "Low";
  score: number; // 0-100
}

// Simple heuristic analyzer using recent entries sleepHours and activityLevel
export function analyzeHealthData(): FitnessResult {
  const entriesWithContext = mockEntries
    .map((e) => e.context)
    .filter(Boolean) as { sleepHours?: number; activityLevel?: string }[];

  if (!entriesWithContext.length) {
    return { fitnessLevel: "Average", score: 50 };
  }

  let sleepSum = 0;
  let sleepCount = 0;
  let activityScoreSum = 0;
  let activityCount = 0;

  for (const c of entriesWithContext) {
    if (typeof c.sleepHours === "number") {
      sleepSum += Math.max(0, Math.min(10, c.sleepHours));
      sleepCount++;
    }
    if (c.activityLevel) {
      const map: Record<string, number> = {
        Low: 0.3,
        Moderate: 0.6,
        High: 0.9,
      };
      activityScoreSum += map[c.activityLevel] ?? 0.5;
      activityCount++;
    }
  }

  const avgSleep = sleepCount ? sleepSum / sleepCount : 6;
  const avgActivity = activityCount ? activityScoreSum / activityCount : 0.6;

  // Score composed of sleep (60%) and activity (40%) mapped to 0-100
  const sleepComponent = Math.max(0, Math.min(1, (avgSleep - 4) / 4));
  const score = Math.round((sleepComponent * 0.6 + avgActivity * 0.4) * 100);

  let fitnessLevel: FitnessResult["fitnessLevel"] = "Average";
  if (score >= 80) fitnessLevel = "Excellent";
  else if (score >= 60) fitnessLevel = "Good";
  else if (score >= 40) fitnessLevel = "Average";
  else fitnessLevel = "Low";

  return { fitnessLevel, score };
}
