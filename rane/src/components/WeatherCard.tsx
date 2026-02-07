import Image from "next/image";
import { WeatherState } from "@/lib/types";
import { weatherMap } from "@/lib/mockData";

interface WeatherCardProps {
  primary: WeatherState;
  secondary?: WeatherState;
  explanation: string;
  compact?: boolean;
}

export default function WeatherCard({
  primary,
  secondary,
  explanation,
  compact = false,
}: WeatherCardProps) {
  const weather = weatherMap[primary];
  const secondaryWeather = secondary ? weatherMap[secondary] : null;

  if (compact) {
    return (
      <div
        className={`rounded-2xl border border-card-border bg-gradient-to-br ${weather.bgGradient} p-4`}
      >
        <div className="flex items-center gap-2">
          {weather.asset ? (
            <Image
              src={weather.asset}
              alt={weather.label}
              width={32}
              height={32}
              className="h-8 w-8"
            />
          ) : (
            <span className="text-2xl">{weather.emoji}</span>
          )}
          <span className="font-medium">{weather.label}</span>
          {secondaryWeather && (
            <span className="text-sm text-muted">
              +{" "}
              {secondaryWeather.asset ? (
                <Image
                  src={secondaryWeather.asset}
                  alt={secondaryWeather.label}
                  width={16}
                  height={16}
                  className="inline h-4 w-4"
                />
              ) : (
                secondaryWeather.emoji
              )} {secondaryWeather.label}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl border border-card-border bg-gradient-to-br ${weather.bgGradient} p-6`}
    >
      <div className="mb-4 flex justify-center">
        {weather.asset ? (
          <Image
            src={weather.asset}
            alt={weather.label}
            width={120}
            height={120}
            className="h-30 w-30"
          />
        ) : (
          <span className="text-5xl">{weather.emoji}</span>
        )}
      </div>
      <h2 className="mb-1 text-center text-xl font-semibold">
        {weather.label}
      </h2>
      <p className="mb-3 text-center text-sm text-muted">
        {weather.description}
      </p>
      {secondaryWeather && (
        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted">
          {secondaryWeather.asset ? (
            <Image
              src={secondaryWeather.asset}
              alt={secondaryWeather.label}
              width={24}
              height={24}
              className="h-6 w-6"
            />
          ) : (
            <span>{secondaryWeather.emoji}</span>
          )}
          <span>with hints of {secondaryWeather.label}</span>
        </div>
      )}
      <div className="rounded-2xl bg-card/60 p-4">
        <p className="leading-relaxed text-foreground/80">{explanation}</p>
      </div>
    </div>
  );
}
