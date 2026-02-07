"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { mockUser } from "@/lib/mockData";

export default function SettingsPage() {
  const [healthData, setHealthData] = useState(mockUser.healthDataEnabled);
  const [cycleTracking, setCycleTracking] = useState(
    mockUser.cycleTrackingEnabled
  );
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-2">
        <div className="mx-auto max-w-lg">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted">Customize your Rane experience</p>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-5 px-6 pt-4">
        {/* Profile */}
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted uppercase">
            Profile
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo to-violet text-xl font-semibold text-white">
              {mockUser.name[0]}
            </div>
            <div>
              <p className="font-medium">{mockUser.name}</p>
              <p className="text-sm text-muted">{mockUser.email}</p>
              <p className="text-xs text-muted/60">
                Joined{" "}
                {new Date(mockUser.joinedDate + "T12:00:00").toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Health Data */}
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted uppercase">
            Health & Context Data
          </h3>
          <p className="mb-4 text-xs leading-relaxed text-muted">
            Health data is used for contextual framing only. No predictions,
            diagnoses, or optimization scoring. Rane works fully without this
            data.
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Apple Health Sync</p>
                <p className="text-xs text-muted">
                  Sleep, activity, heart rate variability
                </p>
              </div>
              <button
                onClick={() => setHealthData(!healthData)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  healthData ? "bg-indigo" : "bg-card-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    healthData ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Cycle Tracking</p>
                <p className="text-xs text-muted">
                  Manual entry for menstrual cycle phase
                </p>
              </div>
              <button
                onClick={() => setCycleTracking(!cycleTracking)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  cycleTracking ? "bg-indigo" : "bg-card-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    cycleTracking ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted uppercase">
            Privacy & Data
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-500">{"\u2713"}</span>
              <span className="text-foreground/70">
                No personal identifiers sent to AI
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-500">{"\u2713"}</span>
              <span className="text-foreground/70">No location tracking</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-500">{"\u2713"}</span>
              <span className="text-foreground/70">
                No monetization of emotional data
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-500">{"\u2713"}</span>
              <span className="text-foreground/70">
                Data stored only with your consent
              </span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">
            About Rane
          </h3>
          <p className="text-xs leading-relaxed text-muted">
            Rane is not a diagnostic or therapeutic tool. No medical advice is
            given. No predictions or guarantees. Your agency is always preserved.
          </p>
          <p className="mt-3 text-xs italic text-muted/60">
            Nothing stays forever — not even storms.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-indigo py-3 text-sm font-medium text-white transition-all hover:bg-indigo/90"
          >
            {showSaved ? "Saved!" : "Save Changes"}
          </button>
          <Link
            href="/auth"
            className="block w-full rounded-xl border border-card-border py-3 text-center text-sm font-medium text-muted transition-all hover:bg-background"
          >
            Sign Out
          </Link>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
