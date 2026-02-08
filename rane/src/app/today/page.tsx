"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import WeatherCard from "@/components/WeatherCard";
import MentalEaseCurve from "@/components/MentalEaseCurve";
import DecisionGuardrails from "@/components/DecisionGuardrails";
import ClosingMessage from "@/components/ClosingMessage";
import ContextBadge from "@/components/ContextBadge";
import ReflectionInput from "@/components/ReflectionInput";
import { DayEntry } from "@/lib/types";
import { ElevenLabsAgent } from "@/components/ElevenLabsAgent";

export default function TodayPage() {
  const [entry, setEntry] = useState<DayEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [noEntry, setNoEntry] = useState(false);

  useEffect(() => {
    fetch("/api/entries/today")
      .then((r) => {
        if (r.status === 404) {
          setNoEntry(true);
          setLoading(false);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setEntry(data);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <div className="animate-pulse text-4xl">{"\u2601\uFE0F"}</div>
        <Navigation />
      </div>
    );
  }

  if (noEntry || !entry) {
    return (
      <div className="min-h-screen pb-24">
        <header className="px-6 pt-8 pb-2">
          <div className="mx-auto max-w-lg">
            <p className="text-sm text-muted">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="text-2xl font-semibold">Today&apos;s Weather</h1>
          </div>
        </header>
        <main className="mx-auto max-w-lg space-y-5 px-6 pt-4">
          <ReflectionInput />
        </main>
        <Navigation />
      </div>
    );
  }

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
        <ReflectionInput initialText={entry.reflection} />

        {/* Decision Guardrails + Suggestions */}
        <DecisionGuardrails
          guardrails={entry.guardrails}
          suggestions={entry.shelterSuggestions}
          cyclePhase={entry.context?.cyclePhase}
        />

        {/* Productivity Possibilities */}
        <MentalEaseCurve
          weather={entry.primaryWeather}
          secondaryWeather={entry.secondaryWeather}
          sleepHours={entry.context?.sleepHours}
        />

        {/* Closing Message */}
        <ClosingMessage message={entry.closingMessage} />

        {/* ElevenLabs voice agent (floating) */}
        <aside>
          <ElevenLabsAgent />
        </aside>
      </main >

      <Navigation />
    </div >
  );
}
