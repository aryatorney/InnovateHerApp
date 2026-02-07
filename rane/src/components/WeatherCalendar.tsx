"use client";

import { useRouter } from "next/navigation";
import { DayEntry } from "@/lib/types";
import { weatherMap } from "@/lib/mockData";

interface WeatherCalendarProps {
  entries: DayEntry[];
  year: number;
  month: number; // 0-indexed
  onMonthChange: (year: number, month: number) => void;
}

// Ombre color map: foggy/stormy (cool) → sunny (warm)
// storms = deep indigo, fog = soft blue, low-tide = muted violet,
// gusts = blush pink, clear-skies = warm sunlight
const weatherOverlayColors: Record<string, string> = {
  storms: "rgba(91, 52, 163, 0.45)",
  fog: "rgba(154, 195, 255, 0.45)",
  "low-tide": "rgba(159, 81, 183, 0.35)",
  gusts: "rgba(234, 162, 202, 0.4)",
  "clear-skies": "rgba(245, 228, 135, 0.5)",
};

// Subtle gradient pairs for the ombre effect on each day cell
const weatherGradients: Record<string, [string, string]> = {
  storms: ["rgba(91, 52, 163, 0.5)", "rgba(159, 81, 183, 0.2)"],
  fog: ["rgba(154, 195, 255, 0.5)", "rgba(232, 226, 244, 0.2)"],
  "low-tide": ["rgba(159, 81, 183, 0.4)", "rgba(154, 195, 255, 0.15)"],
  gusts: ["rgba(234, 162, 202, 0.45)", "rgba(255, 217, 210, 0.2)"],
  "clear-skies": ["rgba(245, 228, 135, 0.55)", "rgba(239, 214, 149, 0.2)"],
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function WeatherCalendar({
  entries,
  year,
  month,
  onMonthChange,
}: WeatherCalendarProps) {
  const router = useRouter();

  // Build lookup: "YYYY-MM-DD" → entry
  const entryMap = new Map<string, DayEntry>();
  entries.forEach((e) => entryMap.set(e.date, e));

  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Build grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const handlePrev = () => {
    if (month === 0) onMonthChange(year - 1, 11);
    else onMonthChange(year, month - 1);
  };

  const handleNext = () => {
    if (month === 11) onMonthChange(year + 1, 0);
    else onMonthChange(year, month + 1);
  };

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5">
      {/* Month nav */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="rounded-lg px-2.5 py-1 text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
        >
          {"\u2190"}
        </button>
        <h3 className="text-sm font-semibold">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          onClick={handleNext}
          className="rounded-lg px-2.5 py-1 text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
        >
          {"\u2192"}
        </button>
      </div>

      {/* Weekday headers */}
      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-[10px] font-medium text-muted/70"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const entry = entryMap.get(dateStr);
          const isToday = dateStr === todayStr;
          const isFuture = dateStr > todayStr;
          const weather = entry ? weatherMap[entry.primaryWeather] : null;
          const gradient = entry ? weatherGradients[entry.primaryWeather] : null;

          return (
            <button
              key={dateStr}
              onClick={() => {
                if (entry) router.push(`/day/${dateStr}`);
              }}
              disabled={!entry}
              className={`relative aspect-square rounded-xl text-xs font-medium transition-all ${
                entry
                  ? "cursor-pointer hover:scale-105 hover:shadow-md"
                  : "cursor-default"
              } ${isToday ? "ring-2 ring-indigo/50" : ""} ${
                isFuture ? "text-muted/30" : "text-foreground/70"
              }`}
              style={
                gradient
                  ? {
                      background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                    }
                  : undefined
              }
            >
              <span className="relative z-10 flex h-full flex-col items-center justify-center gap-0.5">
                <span className={isToday ? "font-bold text-indigo" : ""}>
                  {day}
                </span>
                {weather && (
                  <span className="text-[11px] leading-none">
                    {weather.emoji}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {Object.entries(weatherMap).map(([key, w]) => (
          <div key={key} className="flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: weatherOverlayColors[key] }}
            />
            <span className="text-[10px] text-muted">{w.emoji} {w.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
