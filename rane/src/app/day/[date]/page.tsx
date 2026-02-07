"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import WeatherCard from "@/components/WeatherCard";
import ShelterSuggestions from "@/components/ShelterSuggestions";
import DecisionGuardrails from "@/components/DecisionGuardrails";
import ClosingMessage from "@/components/ClosingMessage";
import ContextBadge from "@/components/ContextBadge";
import { getEntryByDate, mockEntries } from "@/lib/mockData";

export default function DayPage() {
  const params = useParams();
  const dateStr = params.date as string;
  const entry = getEntryByDate(dateStr);

  if (!entry) {
    return (
      <div className="min-h-screen pb-24">
        <header className="px-6 pt-8 pb-2">
          <div className="mx-auto max-w-lg">
            <Link
              href="/timeline"
              className="mb-2 inline-flex items-center gap-1 text-sm text-indigo hover:underline"
            >
              {"\u2190"} Timeline
            </Link>
            <h1 className="text-2xl font-semibold">No Entry Found</h1>
          </div>
        </header>
        <main className="mx-auto max-w-lg px-6 pt-8 text-center">
          <p className="text-5xl">{"\u2601\uFE0F"}</p>
          <p className="mt-4 text-muted">
            No reflection was recorded for this day.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-full bg-indigo px-6 py-2 text-sm font-medium text-white"
          >
            Go Home
          </Link>
        </main>
        <Navigation />
      </div>
    );
  }

  const date = new Date(entry.date + "T12:00:00");
  const currentIndex = mockEntries.findIndex((e) => e.date === dateStr);
  const prevEntry = mockEntries[currentIndex + 1];
  const nextEntry = mockEntries[currentIndex - 1];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-2">
        <div className="mx-auto max-w-lg">
          <Link
            href="/timeline"
            className="mb-2 inline-flex items-center gap-1 text-sm text-indigo hover:underline"
          >
            {"\u2190"} Timeline
          </Link>
          <p className="text-sm text-muted">
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <h1 className="text-2xl font-semibold">Day Report</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-5 px-6 pt-4">
        {/* Context Badges */}
        {entry.context && (
          <ContextBadge
            sleepHours={entry.context.sleepHours}
            activityLevel={entry.context.activityLevel}
            cyclePhase={entry.context.cyclePhase}
          />
        )}

        {/* Weather Card */}
        <WeatherCard
          primary={entry.primaryWeather}
          secondary={entry.secondaryWeather}
          explanation={entry.explanation}
        />

        {/* Reflection */}
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted uppercase">
            Your Reflection
          </h3>
          <p className="text-sm leading-relaxed text-foreground/70">
            {entry.reflection}
          </p>
        </div>

        {/* Shelter Suggestions */}
        <ShelterSuggestions suggestions={entry.shelterSuggestions} />

        {/* Decision Guardrails */}
        <DecisionGuardrails guardrails={entry.guardrails} />

        {/* Closing Message */}
        <ClosingMessage message={entry.closingMessage} />

        {/* Day Navigation */}
        <div className="flex items-center justify-between pt-2">
          {prevEntry ? (
            <Link
              href={`/day/${prevEntry.date}`}
              className="text-sm text-indigo hover:underline"
            >
              {"\u2190"} Previous Day
            </Link>
          ) : (
            <span />
          )}
          {nextEntry ? (
            <Link
              href={`/day/${nextEntry.date}`}
              className="text-sm text-indigo hover:underline"
            >
              Next Day {"\u2192"}
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>

      <Navigation />
    </div>
  );
}
