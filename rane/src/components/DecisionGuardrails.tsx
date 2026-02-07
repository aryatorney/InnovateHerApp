import { DecisionGuardrail, ShelterSuggestion } from "@/lib/types";

interface DecisionGuardrailsProps {
  guardrails: DecisionGuardrail;
  suggestions?: ShelterSuggestion[];
}

export default function DecisionGuardrails({
  guardrails,
  suggestions,
}: DecisionGuardrailsProps) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted uppercase">
        Decision Guardrails
      </h3>

      {/* Suggestions row */}
      {suggestions && suggestions.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-xs font-medium text-blush">Gentle nudges</p>
          <div className="space-y-1.5">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-xl bg-background/60 px-3.5 py-2.5"
              >
                <span className="text-base">{s.icon}</span>
                <span className="text-sm text-foreground/70">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
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
                {item}
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
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
