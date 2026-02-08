"use client";

import { useState } from "react";
import { DecisionGuardrail, ShelterSuggestion } from "@/lib/types";

interface DecisionGuardrailsProps {
  guardrails: DecisionGuardrail;
  suggestions?: ShelterSuggestion[];
  cyclePhase?: string;
}

const PHASE_INSIGHTS: Record<string, string> = {
  Menstrual:
    "During menstruation, energy often turns inward. Your brain's connectivity changes to favor reflection over action. Decision fatigue sets in faster, making this a prime time to pause on big choices and protect your peace.",
  Follicular:
    "As estrogen rises, so does openness to new ideas. You might feel more optimistic and risk-tolerant. It's a great time for brainstorming, but the guardrails help ensure you don't overcommit before your energy fully peaks.",
  Ovulatory:
    "Energy and communication skills are often at their height. You're naturally more outward-facing. The guardrails today are less about protection and more about channeling that high energy effectively without burning out.",
  Luteal:
    "Progesterone rises, which can increase sensitivity to stress and detail. You might spot problems you missed before. The guardrails suggest delaying conflict because your brain is currently wired to detect threat more than reward.",
  "Late Luteal":
    "Right before menstruation, emotional resilience can dip. Your body is preparing to shed. Guardrails prioritizing rest aren't 'lazy'—they are biological necessities to preserve your baseline for the next cycle.",
};

export default function DecisionGuardrails({
  guardrails,
  suggestions,
  cyclePhase,
}: DecisionGuardrailsProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Default insight if phase is missing or unknown
  const insight =
    (cyclePhase && PHASE_INSIGHTS[cyclePhase]) ||
    "Your inner weather changes day by day. These suggestions are designed to align your actions with your current energy levels, helping you move with the current rather than swimming against it.";

  return (
    <div className="group prose-none relative w-full [perspective:1000px]">
      <div
        className={`relative w-full transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
      >
        {/* FRONT */}
        <div className="relative w-full rounded-2xl border border-card-border bg-card p-5 [backface-visibility:hidden]">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold tracking-wide text-muted uppercase">
                Decision Guardrails
              </h3>
              <button
                onClick={() => setIsFlipped(true)}
                className="rounded-full bg-indigo/10 px-3 py-1 text-xs font-medium text-indigo hover:bg-indigo/20 transition-colors"
              >
                Learn Why &rarr;
              </button>
            </div>

            {/* Suggestions row - Compact version if space is tight, but standard for now */}
            {suggestions && suggestions.length > 0 && (
              <div className="mb-4 space-y-2 flex-shrink-0">
                <p className="text-xs font-medium text-blush">Gentle nudges</p>
                <div className="space-y-1.5">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 rounded-xl bg-background/60 px-3.5 py-2"
                    >
                      <span className="text-base">{s.icon}</span>
                      <span className="text-sm text-foreground/70 truncate">
                        {s.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 flex-grow">
              <div>
                <p className="mb-2 text-xs font-medium text-violet">
                  Not ideal today for
                </p>
                <ul className="space-y-1.5">
                  {guardrails.notIdeal.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground/70"
                    >
                      <span className="mt-0.5 text-violet/60">&#x2013;</span>
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-indigo">
                  Better suited for
                </p>
                <ul className="space-y-1.5">
                  {guardrails.betterSuited.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground/70"
                    >
                      <span className="mt-0.5 text-indigo/60">+</span>
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 h-full w-full rounded-2xl border border-card-border bg-card p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex h-full flex-col justify-center text-center">
            <div className="mb-4 flex justify-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo/10 text-xl">
                💡
              </span>
            </div>

            <h4 className="mb-3 text-lg font-semibold text-foreground">
              Why these suggestions?
            </h4>

            {cyclePhase && (
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-indigo">
                Current Phase: {cyclePhase}
              </p>
            )}

            <p className="mb-6 text-sm leading-relaxed text-muted/90">
              {insight}
            </p>

            <button
              onClick={() => setIsFlipped(false)}
              className="mx-auto rounded-full border border-card-border bg-background px-6 py-2 text-sm font-medium text-foreground hover:bg-card-border/50 transition-colors"
            >
              Flip Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
