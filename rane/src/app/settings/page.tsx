"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import Navigation from "@/components/Navigation";
import { predictCyclePhase, getDayOfCycle } from "@/lib/cycleUtils";

export default function SettingsPage() {
  const { user, isLoading } = useUser();
  const [healthData, setHealthData] = useState(false);
  const [cycleTracking, setCycleTracking] = useState(false);
  const [lastPeriodStart, setLastPeriodStart] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [showSaved, setShowSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    async function loadPrefs() {
      try {
        const res = await fetch("/api/preferences");
        if (!res.ok) return;
        const data = await res.json();
        setHealthData(data.healthDataEnabled ?? false);
        setCycleTracking(data.cycleTrackingEnabled ?? false);
        setCycleLength(data.cycleLength ?? 28);
        if (data.lastPeriodStart) {
          setLastPeriodStart(
            new Date(data.lastPeriodStart).toISOString().split("T")[0]
          );
        }
      } catch {
        // Preferences not available, keep defaults
      } finally {
        setLoaded(true);
      }
    }
    loadPrefs();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          healthDataEnabled: healthData,
          cycleTrackingEnabled: cycleTracking,
          lastPeriodStart: lastPeriodStart || null,
          cycleLength,
        }),
      });
      if (res.ok) {
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
      }
    } catch {
      // Save failed silently
    } finally {
      setSaving(false);
    }
  };

  // Compute predicted phase for display
  const predictedPhase =
    cycleTracking && lastPeriodStart
      ? predictCyclePhase(new Date(lastPeriodStart), cycleLength)
      : null;

  const dayOfCycle =
    cycleTracking && lastPeriodStart
      ? getDayOfCycle(new Date(lastPeriodStart), cycleLength)
      : null;

  const displayName = user?.name || user?.nickname || "User";
  const displayEmail = user?.email || "";
  const initial = displayName[0]?.toUpperCase() || "?";

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
          {isLoading ? (
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 animate-pulse rounded-full bg-card-border" />
              <div className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-card-border" />
                <div className="h-3 w-36 animate-pulse rounded bg-card-border" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={displayName}
                  className="h-14 w-14 rounded-full"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo to-violet text-xl font-semibold text-white">
                  {initial}
                </div>
              )}
              <div>
                <p className="font-medium">{displayName}</p>
                <p className="text-sm text-muted">{displayEmail}</p>
              </div>
            </div>
          )}
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

            {/* Cycle Tracking Inputs */}
            {cycleTracking && (
              <div className="mt-2 space-y-4 rounded-xl bg-background/60 p-4">
                <div>
                  <label
                    htmlFor="lastPeriodStart"
                    className="mb-1.5 block text-xs font-medium text-muted"
                  >
                    When did your last period start?
                  </label>
                  <input
                    type="date"
                    id="lastPeriodStart"
                    value={lastPeriodStart}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setLastPeriodStart(e.target.value)}
                    className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground focus:border-indigo focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cycleLength"
                    className="mb-1.5 block text-xs font-medium text-muted"
                  >
                    Average cycle length (days)
                  </label>
                  <input
                    type="number"
                    id="cycleLength"
                    value={cycleLength}
                    min={21}
                    max={40}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) setCycleLength(Math.max(21, Math.min(40, val)));
                    }}
                    className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground focus:border-indigo focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-muted/70">
                    Typical range: 21–40 days
                  </p>
                </div>

                {/* Predicted Phase Display */}
                {predictedPhase && dayOfCycle && (
                  <div className="rounded-lg border border-indigo/20 bg-indigo/5 px-4 py-3">
                    <p className="text-xs font-medium text-indigo">
                      Current predicted phase
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {predictedPhase}
                      <span className="ml-2 text-xs font-normal text-muted">
                        Day {dayOfCycle} of {cycleLength}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
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
            disabled={saving}
            className="w-full rounded-xl bg-indigo py-3 text-sm font-medium text-white transition-all hover:bg-indigo/90 disabled:opacity-50"
          >
            {showSaved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </button>
          <a
            href="/api/auth/logout"
            className="block w-full rounded-xl border border-card-border py-3 text-center text-sm font-medium text-muted transition-all hover:bg-background"
          >
            Sign Out
          </a>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
