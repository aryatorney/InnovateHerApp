"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import WeatherCalendar from "@/components/WeatherCalendar";
import { weatherMap } from "@/lib/mockData";
import { DayEntry } from "@/lib/types";

type ProductivityLevel = "low" | "medium" | "high";
type TimeOfDay = "morning" | "midday" | "evening";

interface TimeSlot {
  productivityLevel: ProductivityLevel;
  insight: string;
  suggestion: string;
}

interface AiInsights {
  morning: TimeSlot;
  midday: TimeSlot;
  evening: TimeSlot;
}

interface EntryWithAi extends DayEntry {
  _id?: string;
  aiInsights?: AiInsights;
}

const LEVEL_COLOR: Record<ProductivityLevel, string> = {
  low: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-emerald-100 text-emerald-700",
};

const LEVEL_BAR: Record<ProductivityLevel, string> = {
  low: "w-1/3 bg-red-400",
  medium: "w-2/3 bg-amber-400",
  high: "w-full bg-emerald-400",
};

const TIME_LABELS: Record<TimeOfDay, string> = {
  morning: "Morning",
  midday: "Midday",
  evening: "Evening",
};

/** Aggregate productivity trends across entries that have aiInsights */
function computeTrends(entries: EntryWithAi[]) {
  const counts: Record<TimeOfDay, Record<ProductivityLevel, number>> = {
    morning: { low: 0, medium: 0, high: 0 },
    midday: { low: 0, medium: 0, high: 0 },
    evening: { low: 0, medium: 0, high: 0 },
  };
  let total = 0;

  for (const entry of entries) {
    if (!entry.aiInsights) continue;
    total++;
    for (const time of ["morning", "midday", "evening"] as TimeOfDay[]) {
      const slot = entry.aiInsights[time];
      if (slot?.productivityLevel) {
        counts[time][slot.productivityLevel]++;
      }
    }
  }

  if (total === 0) return null;

  // Find dominant level per time of day
  const dominant: Record<TimeOfDay, ProductivityLevel> = {} as any;
  for (const time of ["morning", "midday", "evening"] as TimeOfDay[]) {
    const c = counts[time];
    if (c.high >= c.medium && c.high >= c.low) dominant[time] = "high";
    else if (c.medium >= c.low) dominant[time] = "medium";
    else dominant[time] = "low";
  }

  return { counts, dominant, total };
}

export default function TimelinePage() {
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [entries, setEntries] = useState<EntryWithAi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/entries")
      .then((r) => r.json())
      .then((data) => {
        setEntries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const trends = computeTrends(entries);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-2">
        <div className="mx-auto max-w-lg">
          <h1 className="text-2xl font-semibold">Timeline</h1>
          <p className="text-sm text-muted">Your inner weather over time</p>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 pt-4">
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-pulse text-4xl">{"\u2601\uFE0F"}</div>
            <p className="mt-2 text-sm text-muted">Loading your timeline...</p>
          </div>
        ) : (
          <>
            {/* Weather Calendar */}
            <div className="mb-6">
              <WeatherCalendar
                entries={entries}
                year={calYear}
                month={calMonth}
                onMonthChange={(y, m) => {
                  setCalYear(y);
                  setCalMonth(m);
                }}
              />
            </div>

            {/* Productivity Trends */}
            {trends && (
              <div className="mb-6 rounded-2xl border border-card-border bg-card p-5">
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">
                  Productivity Trends
                </h3>
                <p className="mb-4 text-xs text-muted">
                  Based on {trends.total} {trends.total === 1 ? "entry" : "entries"} with AI insights
                </p>
                <div className="space-y-3">
                  {(["morning", "midday", "evening"] as TimeOfDay[]).map((time) => (
                    <div key={time} className="flex items-center gap-3">
                      <span className="w-16 text-xs font-medium text-foreground/70">
                        {TIME_LABELS[time]}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-foreground/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${LEVEL_BAR[trends.dominant[time]]}`}
                        />
                      </div>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${LEVEL_COLOR[trends.dominant[time]]}`}
                      >
                        {trends.dominant[time]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pattern Insight */}
            {entries.length > 0 && (
              <div className="mb-6 rounded-2xl bg-gradient-to-br from-indigo/8 to-violet/8 p-4">
                <p className="text-sm leading-relaxed text-foreground/70">
                  {"\uD83D\uDD0D"}{" "}
                  <span className="font-medium">Pattern:</span> Storms tend to
                  appear after prolonged responsibility. Fog often follows
                  low-sleep days during late cycle phases.
                </p>
              </div>
            )}

            {/* Entries */}
            <div className="space-y-3">
              {entries.map((entry: any) => {
                const weather = weatherMap[entry.primaryWeather];
                if (!weather) return null;
                const secondary = entry.secondaryWeather
                  ? weatherMap[entry.secondaryWeather]
                  : null;
                const date = new Date(entry.date + "T12:00:00");
                const ai: AiInsights | undefined = entry.aiInsights;

                return (
                  <Link
                    key={entry._id || entry.date}
                    href={`/day/${entry.date}`}
                    className="block rounded-2xl border border-card-border bg-card p-4 transition-all hover:shadow-md"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {weather.asset ? (
                          <Image
                            src={weather.asset}
                            alt={weather.label}
                            width={32}
                            height={32}
                            className="h-8 w-8"
                          />
                        ) : (
                          <span className="text-2xl">{weather.emoji}</span>
                        )}
                        <div>
                          <p className="text-sm font-medium">{weather.label}</p>
                          {secondary && (
                            <p className="text-xs text-muted flex items-center gap-1">
                              +{" "}
                              {secondary.asset ? (
                                <Image
                                  src={secondary.asset}
                                  alt={secondary.label}
                                  width={16}
                                  height={16}
                                  className="h-4 w-4"
                                />
                              ) : (
                                secondary.emoji
                              )}{" "}
                              {secondary.label}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted">
                        {date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted line-clamp-2">
                      {entry.explanation}
                    </p>

                    {/* AI Insights chips */}
                    {ai && (
                      <div className="mt-2 flex gap-1.5">
                        {(["morning", "midday", "evening"] as TimeOfDay[]).map((time) => {
                          const slot = ai[time];
                          if (!slot?.productivityLevel) return null;
                          return (
                            <span
                              key={time}
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${LEVEL_COLOR[slot.productivityLevel]}`}
                            >
                              {TIME_LABELS[time][0]}: {slot.productivityLevel}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {entry.context && (
                      <div className="mt-2 flex gap-2">
                        {entry.context.sleepHours !== undefined && (
                          <span className="text-[10px] text-muted/70">
                            {"\uD83D\uDCA4"} {entry.context.sleepHours}h
                          </span>
                        )}
                        {entry.context.cyclePhase && (
                          <span className="text-[10px] text-muted/70">
                            {"\uD83C\uDF19"} {entry.context.cyclePhase}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            {entries.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-3xl">{"\u2601\uFE0F"}</p>
                <p className="mt-2 text-sm text-muted">
                  No entries yet. Start by reflecting on your day.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Navigation />
    </div>
  );
}
