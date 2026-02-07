"use client";

import Navigation from "@/components/Navigation";
import WeatherCard from "@/components/WeatherCard";
import MentalEaseCurve from "@/components/MentalEaseCurve";
import DecisionGuardrails from "@/components/DecisionGuardrails";
import ClosingMessage from "@/components/ClosingMessage";
import ContextBadge from "@/components/ContextBadge";
import { getTodayEntry } from "@/lib/mockData";

export default function TodayPage() {
  const entry = getTodayEntry();
  const date = new Date(entry.date + "T12:00:00");

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-2">
        <div className="mx-auto max-w-lg">
          <p className="text-sm text-muted">
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-2xl font-semibold">Today&apos;s Weather</h1>
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

        {/* Your Reflection */}
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted uppercase">
            Your Reflection
          </h3>
          <p className="text-sm leading-relaxed text-foreground/70">
            {entry.reflection}
          </p>
        </div>

        {/* Decision Guardrails + Suggestions */}
        <DecisionGuardrails
          guardrails={entry.guardrails}
          suggestions={entry.shelterSuggestions}
        />

        {/* Productivity Possibilities */}
        <MentalEaseCurve
          weather={entry.primaryWeather}
          secondaryWeather={entry.secondaryWeather}
          sleepHours={entry.context?.sleepHours}
        />

        {/* Closing Message */}
        <ClosingMessage message={entry.closingMessage} />
      </main>

      <Navigation />
    </div>
  );
}
