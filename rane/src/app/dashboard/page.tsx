"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import WeatherCard from "@/components/WeatherCard";
import ReflectionInput from "@/components/ReflectionInput";
import { mockEntries, mockUser, weatherMap } from "@/lib/mockData";

export default function DashboardPage() {
  const todayEntry = mockEntries[0];
  const recentEntries = mockEntries.slice(1, 4);
  const hasReflectedToday = true;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <div className="mx-auto max-w-lg">
          <p className="text-sm text-muted">Good evening,</p>
          <h1 className="text-2xl font-semibold">{mockUser.name}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-6 px-6">
        {/* Today's Weather Summary */}
        {hasReflectedToday ? (
          <Link href="/today" className="block">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted">
                Today&apos;s Inner Weather
              </h2>
              <WeatherCard
                primary={todayEntry.primaryWeather}
                secondary={todayEntry.secondaryWeather}
                explanation={todayEntry.explanation}
              />
            </div>
          </Link>
        ) : (
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted">
              How are you feeling?
            </h2>
            <ReflectionInput />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/today"
            className="rounded-2xl border border-card-border bg-card p-4 transition-all hover:shadow-md"
          >
            <span className="mb-1 block text-lg">
              {weatherMap[todayEntry.primaryWeather].emoji}
            </span>
            <span className="text-sm font-medium">View Today</span>
            <p className="mt-0.5 text-xs text-muted">Full weather report</p>
          </Link>
          <Link
            href="/timeline"
            className="rounded-2xl border border-card-border bg-card p-4 transition-all hover:shadow-md"
          >
            <span className="mb-1 block text-lg">{"\uD83D\uDCC5"}</span>
            <span className="text-sm font-medium">Timeline</span>
            <p className="mt-0.5 text-xs text-muted">See your patterns</p>
          </Link>
        </div>

        {/* Closing Message */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo/8 to-violet/8 p-5 text-center">
          <p className="text-sm italic leading-relaxed text-foreground/70">
            &ldquo;{todayEntry.closingMessage}&rdquo;
          </p>
        </div>

        {/* Recent Entries */}
        <div>
          <h2 className="mb-3 text-sm font-medium text-muted">Recent Days</h2>
          <div className="space-y-2">
            {recentEntries.map((entry) => {
              const weather = weatherMap[entry.primaryWeather];
              const date = new Date(entry.date + "T12:00:00");
              return (
                <Link
                  key={entry.date}
                  href={`/day/${entry.date}`}
                  className="flex items-center gap-4 rounded-2xl border border-card-border bg-card p-4 transition-all hover:shadow-md"
                >
                  <span className="text-2xl">{weather.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{weather.label}</p>
                    <p className="truncate text-xs text-muted">
                      {entry.reflection.slice(0, 60)}...
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pattern Insight */}
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted uppercase">
            Pattern Insight
          </h3>
          <p className="text-sm leading-relaxed text-foreground/70">
            Storms tend to appear after prolonged responsibility. Fog often
            follows low-sleep days during late cycle phases.
          </p>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
