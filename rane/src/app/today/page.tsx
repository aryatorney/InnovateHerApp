"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // 1. Fetch Today's Entry
    fetch("/api/entries/today")
      .then((r) => {
        if (r.status === 404) {
          setNoEntry(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setEntry(data);
      })
      .catch(() => { })
      .finally(() => setLoading(false));

    // 2. Fetch Preferences to check if onboarding is needed
    fetch("/api/preferences")
      .then((r) => r.json())
      .then((data) => {
        // If API returns false explicitly, show onboarding
        if (data.hasSetPreferences === false) {
          setShowOnboarding(true);
        }
      })
      .catch(() => { });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <div className="animate-pulse text-4xl">☁️</div>
        <Navigation />
      </div>
    );
  }

  // Common Header
  const header = (
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
  );

  // Common Onboarding Card
  const onboardingCard = showOnboarding && (
    <div className="rounded-2xl border border-indigo/20 bg-indigo/5 p-5 mb-6 relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-indigo mb-1">Welcome to Rane</h3>
        <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
          To get the most accurate "Inner Weather" reading, import your context data in Settings.
        </p>
        <Link
          href="/settings"
          className="inline-flex items-center justify-center rounded-xl bg-indigo px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo/90"
        >
          Complete Profile &rarr;
        </Link>
      </div>
      {/* Decorative background blur */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo/10 blur-2xl" />
    </div>
  );

  if (noEntry || !entry) {
    return (
      <div className="min-h-screen pb-24">
        {header}
        <main className="mx-auto max-w-lg px-6 pt-4">
          {onboardingCard}
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
      {header}

      <main className="mx-auto max-w-lg space-y-5 px-6 pt-4">
        {onboardingCard}

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
