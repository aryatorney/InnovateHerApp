"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import WeatherCalendar from "@/components/WeatherCalendar";
import { weatherMap } from "@/lib/mockData";
import { DayEntry } from "@/lib/types";

export default function TimelinePage() {
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [entries, setEntries] = useState<DayEntry[]>([]);
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

            {/* Pattern Insight */}
            {entries.length > 0 && (
              <div className="rounded-2xl bg-gradient-to-br from-indigo/8 to-violet/8 p-4">
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
