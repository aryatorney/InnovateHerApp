/**
 * Cycle phase prediction based on last period start date.
 *
 * Standard 28-day cycle (adjustable 21–40):
 * - Menstrual:    Days 1–5
 * - Follicular:   Days 6–13
 * - Ovulatory:    Days 14–16
 * - Luteal:       Days 17–24
 * - Late Luteal:  Days 25–end of cycle
 */

export function getDayOfCycle(lastPeriodStart: Date, cycleLength = 28): number {
    const now = new Date();
    const start = new Date(lastPeriodStart);
    // Zero out time portions for accurate day calculation
    now.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    const diffMs = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Wrap around cycle length (day 1-indexed)
    return (diffDays % cycleLength) + 1;
}

export function predictCyclePhase(
    lastPeriodStart: Date | null | undefined,
    cycleLength = 28
): string | null {
    if (!lastPeriodStart) return null;

    const start = new Date(lastPeriodStart);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    // If the start date is in the future or more than 40 days ago (irregular), return null
    const diffMs = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null;
    if (diffDays > cycleLength * 2) return null; // Too far out, likely irregular

    const day = getDayOfCycle(lastPeriodStart, cycleLength);

    if (day <= 5) return "Menstrual";
    if (day <= 13) return "Follicular";
    if (day <= 16) return "Ovulatory";
    if (day <= 24) return "Luteal";
    return "Late Luteal";
}
