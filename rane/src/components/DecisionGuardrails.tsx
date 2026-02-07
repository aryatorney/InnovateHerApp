import { DecisionGuardrail } from "@/lib/types";

interface DecisionGuardrailsProps {
  guardrails: DecisionGuardrail;
}

export default function DecisionGuardrails({
  guardrails,
}: DecisionGuardrailsProps) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted uppercase">
        Decision Guardrails
      </h3>
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
