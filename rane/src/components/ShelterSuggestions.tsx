import { ShelterSuggestion } from "@/lib/types";

interface ShelterSuggestionsProps {
  suggestions: ShelterSuggestion[];
}

export default function ShelterSuggestions({
  suggestions,
}: ShelterSuggestionsProps) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">
        Shelter Suggestions
      </h3>
      <div className="space-y-2.5">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl bg-background/60 px-4 py-3"
          >
            <span className="text-lg">{s.icon}</span>
            <span className="text-sm">{s.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
