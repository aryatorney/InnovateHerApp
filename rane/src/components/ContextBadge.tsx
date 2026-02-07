interface ContextBadgeProps {
  sleepHours?: number;
  activityLevel?: string;
  cyclePhase?: string;
}

export default function ContextBadge({
  sleepHours,
  activityLevel,
  cyclePhase,
}: ContextBadgeProps) {
  const items = [
    sleepHours !== undefined && {
      label: `${sleepHours}h sleep`,
      icon: "\uD83D\uDCA4",
    },
    activityLevel && { label: activityLevel, icon: "\uD83C\uDFC3\u200D\u2640\uFE0F" },
    cyclePhase && { label: cyclePhase, icon: "\uD83C\uDF19" },
  ].filter(Boolean) as { label: string; icon: string }[];

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-card px-3 py-1 text-xs text-muted"
        >
          <span>{item.icon}</span>
          {item.label}
        </span>
      ))}
    </div>
  );
}
