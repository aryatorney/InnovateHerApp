import { WeatherInfo } from "./types";

export const weatherMap: Record<string, WeatherInfo> = {
  storms: {
    id: "storms",
    label: "Emotional Storms",
    emoji: "\u26C8\uFE0F",
    asset: "/storm.png",
    description: "Overwhelm, anxiety, irritability",
    color: "#5B34A3",
    bgGradient: "from-indigo/30 to-violet/20",
  },
  fog: {
    id: "fog",
    label: "Fog",
    emoji: "\uD83C\uDF2B\uFE0F",
    asset: "/foggy.png",
    description: "Mental fatigue, indecision",
    color: "#9AC3FF",
    bgGradient: "from-sky-blue/30 to-card-border/20",
  },
  "low-tide": {
    id: "low-tide",
    label: "Low Tide",
    emoji: "\uD83C\uDF0A",
    description: "Withdrawal, numbness, inward energy",
    color: "#9F51B7",
    bgGradient: "from-violet/20 to-sky-blue/20",
  },
  gusts: {
    id: "gusts",
    label: "Gusts",
    emoji: "\uD83C\uDF2C\uFE0F",
    asset: "/gust.png",
    description: "Sensitivity, sudden mood shifts",
    color: "#EAA2CA",
    bgGradient: "from-blush/30 to-peach/20",
  },
  "clear-skies": {
    id: "clear-skies",
    label: "Clear Skies",
    emoji: "\u2600\uFE0F",
    description: "Clarity, emotional ease",
    color: "#F5E487",
    bgGradient: "from-sunlight/70 to-peach/30",
  },
};
