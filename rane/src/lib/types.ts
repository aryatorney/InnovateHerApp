export type WeatherState =
  | "storms"
  | "fog"
  | "low-tide"
  | "gusts"
  | "clear-skies";

export interface WeatherInfo {
  id: WeatherState;
  label: string;
  emoji: string;
  description: string;
  color: string;
  bgGradient: string;
}

export interface ShelterSuggestion {
  text: string;
  icon: string;
}

export interface DecisionGuardrail {
  notIdeal: string[];
  betterSuited: string[];
}

export interface DayEntry {
  date: string;
  reflection: string;
  primaryWeather: WeatherState;
  secondaryWeather?: WeatherState;
  explanation: string;
  shelterSuggestions: ShelterSuggestion[];
  guardrails: DecisionGuardrail;
  closingMessage: string;
  context?: {
    sleepHours?: number;
    activityLevel?: string;
    cyclePhase?: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  joinedDate: string;
  healthDataEnabled: boolean;
  cycleTrackingEnabled: boolean;
}
