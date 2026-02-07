"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import WeatherCalendar from "@/components/WeatherCalendar";
import { mockEntries, weatherMap } from "@/lib/mockData";

export default function TimelinePage() {
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [filter, setFilter] = useState("all");

  const allWeatherTypes = Object.keys(weatherMap);

  const weatherCounts = mockEntries.reduce((acc, entry) => {
    acc[entry.primaryWeather] = (acc[entry.primaryWeather] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filtered = mockEntries.filter(
    (entry) => filter === "all" || entry.primaryWeather === filter
  );


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

        {/* Weather Distribution */}
        <div className="mb-6 rounded-2xl border border-card-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">
            Weather Distribution
          </h3>
          <div className="flex items-end gap-2">
            {allWeatherTypes.map((type) => {
              const count = weatherCounts[type] || 0;
              const maxCount = Math.max(...Object.values(weatherCounts));
              const height = maxCount > 0 ? (count / maxCount) * 64 : 0;
              const weather = weatherMap[type];
              return (
                <button
                  key={type}
                  onClick={() =>
                    setFilter(filter === type ? "all" : type)
                  }
                  className={`flex flex-1 flex-col items-center gap-1 rounded-xl p-2 transition-all ${filter === type
                    ? "bg-indigo/10 ring-1 ring-indigo/30"
                    : "hover:bg-background"
                    }`}
                >
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-indigo/30 to-violet/20 transition-all"
                    style={{ height: `${Math.max(height, 4)}px` }}
                  />
                  {weather.asset ? (
                    <Image
                      src={weather.asset}
                      alt={weather.label}
                      width={20}
                      height={20}
                      className="h-5 w-5"
                    />
                  ) : (
                    <span className="text-lg">{weather.emoji}</span>
                  )}
                  <span className="text-[10px] text-muted">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Label */}
        {filter !== "all" && (
          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">Showing:</span>
              {(() => {
                const filterWeather = weatherMap[filter];
                return filterWeather.asset ? (
                  <Image
                    src={filterWeather.asset}
                    alt={filterWeather.label}
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                ) : (
                  <span className="text-sm">{filterWeather.emoji}</span>
                );
              })()}
              <span className="text-sm text-muted">{weatherMap[filter].label}</span>
            </div>
            <button
              onClick={() => setFilter("all")}
              className="rounded-full bg-card-border/50 px-2 py-0.5 text-xs text-muted hover:text-foreground"
            >
              Clear
            </button>
          </div>
        )}


        {/* Weather Calendar */}
        <div className="mb-6">
          <WeatherCalendar
            entries={mockEntries}
            year={calYear}
            month={calMonth}
            onMonthChange={(y, m) => {
              setCalYear(y);
              setCalMonth(m);
            }}
          />
        </div>

        {/* Pattern Insight */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo/8 to-violet/8 p-4">
          <p className="text-sm leading-relaxed text-foreground/70">
            {"\uD83D\uDD0D"}{" "}
            <span className="font-medium">Pattern:</span> Storms tend to appear
            after prolonged responsibility. Fog often follows low-sleep days
            during late cycle phases.
          </p>
        </div>

        {/* Entries */}
        <div className="space-y-3">
          {filtered.map((entry) => {
            const weather = weatherMap[entry.primaryWeather];
            const secondary = entry.secondaryWeather
              ? weatherMap[entry.secondaryWeather]
              : null;
            const date = new Date(entry.date + "T12:00:00");

            return (
              <Link
                key={entry.date}
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
                          )} {secondary.label}
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

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-3xl">{"\u2601\uFE0F"}</p>
            <p className="mt-2 text-sm text-muted">
              No entries with this weather type yet.
            </p>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
