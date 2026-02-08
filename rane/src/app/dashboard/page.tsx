"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import WeatherCard from "@/components/WeatherCard";
import ReflectionInput from "@/components/ReflectionInput";
import { weatherMap } from "@/lib/mockData";
import { DayEntry } from "@/lib/types";
import { useUser } from "@auth0/nextjs-auth0/client";
import { analyzeHealthData, FitnessResult } from "@/lib/health";

export default function DashboardPage() {
  const { user } = useUser();
  const [fitness, setFitness] = useState<FitnessResult | null>(null);
  const [healthConnected, setHealthConnected] = useState<boolean | null>(null);
  const [todayEntry, setTodayEntry] = useState<DayEntry | null>(null);
  const [recentEntries, setRecentEntries] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const connected = localStorage.getItem("health:connected");
      if (connected === "true") {
        setHealthConnected(true);
      } else if (connected === "false") {
        setHealthConnected(false);
      } else {
        setHealthConnected(null);
      }
    } catch {
      setHealthConnected(null);
    }
  }, []);

  useEffect(() => {
    // Fetch today's entry
    fetch("/api/entries/today")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setTodayEntry(data);
      })
      .catch(() => {});

    // Fetch recent entries for the list + compute fitness from real data
    fetch("/api/entries")
      .then((r) => r.json())
      .then((data) => {
        const all: DayEntry[] = Array.isArray(data) ? data : [];
        setRecentEntries(all.slice(1, 4));
        setLoading(false);

        // Compute fitness from real entry contexts
        if (healthConnected) {
          const contexts = all
            .map((e) => e.context)
            .filter(Boolean) as { sleepHours?: number; activityLevel?: string }[];
          const result = analyzeHealthData(contexts);
          setFitness(result);
        }
      })
      .catch(() => setLoading(false));
  }, [healthConnected]);

  const displayName = user?.name || user?.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <div className="mx-auto max-w-lg">
          <p className="text-sm text-muted">Good evening,</p>
          <h1 className="text-2xl font-semibold">{displayName}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-6 px-6">
        {/* Fitness Assessment */}
        <div>
          <h2 className="text-sm font-medium text-muted">Fitness</h2>
          <div className="mt-2 rounded-2xl border border-card-border bg-card p-4">
            {healthConnected === true ? (
              <div>
                <p className="text-sm font-semibold">
                  {fitness ? fitness.fitnessLevel : "Analyzing..."}
                </p>
                {fitness && (
                  <p className="mt-1 text-xs text-muted">
                    Score: {fitness.score}
                  </p>
                )}
              </div>
            ) : healthConnected === false ? (
              <p className="text-sm text-muted">N/A (not connected)</p>
            ) : (
              <p className="text-sm text-muted">
                Sign in to choose connection
              </p>
            )}
          </div>
        </div>

        {/* Today's Weather Summary */}
        {todayEntry ? (
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
              {todayEntry
                ? weatherMap[todayEntry.primaryWeather]?.emoji || "\u2601\uFE0F"
                : "\u2601\uFE0F"}
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
        {todayEntry && (
          <div className="rounded-2xl bg-gradient-to-br from-indigo/8 to-violet/8 p-5 text-center">
            <p className="text-sm italic leading-relaxed text-foreground/70">
              &ldquo;{todayEntry.closingMessage}&rdquo;
            </p>
          </div>
        )}

        {/* Recent Entries */}
        {!loading && recentEntries.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-medium text-muted">
              Recent Days
            </h2>
            <div className="space-y-2">
              {recentEntries.map((entry: any) => {
                const weather = weatherMap[entry.primaryWeather];
                if (!weather) return null;
                const date = new Date(entry.date + "T12:00:00");
                return (
                  <Link
                    key={entry._id || entry.date}
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
        )}

        {/* Pattern Insight */}
        {!loading && recentEntries.length > 0 && (
          <div className="rounded-2xl border border-card-border bg-card p-5">
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted uppercase">
              Pattern Insight
            </h3>
            <p className="text-sm leading-relaxed text-foreground/70">
              Storms tend to appear after prolonged responsibility. Fog often
              follows low-sleep days during late cycle phases.
            </p>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
