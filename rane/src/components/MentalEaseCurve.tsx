"use client";

import { WeatherState } from "@/lib/types";

interface MentalEaseCurveProps {
  weather: WeatherState;
  secondaryWeather?: WeatherState;
  sleepHours?: number;
}

// Base curve templates per weather type (Morning → Night, values 0–1)
const baseCurves: Record<WeatherState, number[]> = {
  fog: [0.35, 0.4, 0.38, 0.42, 0.36, 0.3, 0.28, 0.22, 0.18, 0.15],
  storms: [0.6, 0.45, 0.7, 0.25, 0.55, 0.2, 0.5, 0.3, 0.35, 0.28],
  "low-tide": [0.25, 0.22, 0.2, 0.22, 0.2, 0.18, 0.2, 0.18, 0.15, 0.12],
  "clear-skies": [0.5, 0.6, 0.7, 0.75, 0.78, 0.76, 0.72, 0.65, 0.55, 0.45],
  gusts: [0.55, 0.3, 0.65, 0.35, 0.7, 0.25, 0.6, 0.4, 0.55, 0.3],
};

const timeLabels = ["6am", "9am", "12pm", "3pm", "6pm", "9pm"];

function applySleepModifier(curve: number[], sleepHours?: number): number[] {
  if (sleepHours === undefined) return curve;
  // Low sleep caps maximum ease
  const factor = Math.min(1, sleepHours / 8);
  return curve.map((v) => v * (0.6 + 0.4 * factor));
}

export default function MentalEaseCurve({
  weather,
  secondaryWeather,
  sleepHours,
}: MentalEaseCurveProps) {
  const base = baseCurves[weather];
  const points = applySleepModifier(base, sleepHours);

  // If there's secondary weather, blend in a faint second curve
  const secondaryPoints = secondaryWeather
    ? applySleepModifier(baseCurves[secondaryWeather], sleepHours)
    : null;

  const width = 320;
  const height = 140;
  const padX = 32;
  const padTop = 16;
  const padBottom = 28;
  const graphW = width - padX * 2;
  const graphH = height - padTop - padBottom;

  function toPath(pts: number[]): string {
    const segW = graphW / (pts.length - 1);
    // Build smooth cubic bezier path
    const coords = pts.map((v, i) => ({
      x: padX + i * segW,
      y: padTop + graphH * (1 - v),
    }));

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cpx1 = prev.x + segW * 0.4;
      const cpx2 = curr.x - segW * 0.4;
      d += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }

  function toAreaPath(pts: number[]): string {
    const path = toPath(pts);
    const segW = graphW / (pts.length - 1);
    const lastX = padX + (pts.length - 1) * segW;
    const bottom = padTop + graphH;
    return `${path} L ${lastX} ${bottom} L ${padX} ${bottom} Z`;
  }

  // Find current "time" dot (mock: mid-afternoon ~index 5)
  const nowIndex = 5;
  const nowSegW = graphW / (points.length - 1);
  const nowX = padX + nowIndex * nowSegW;
  const nowY = padTop + graphH * (1 - points[nowIndex]);

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5">
      <h3 className="mb-1 text-sm font-semibold tracking-wide text-muted uppercase">
        Productivity Possibilities
      </h3>
      <p className="mb-3 text-xs text-muted/70">
        How your inner weather may shape your day
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--indigo)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--indigo)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="secondaryGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--violet)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--violet)" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Y-axis labels */}
        <text
          x={padX - 4}
          y={padTop + 4}
          textAnchor="end"
          className="fill-muted/50"
          fontSize="8"
        >
          High
        </text>
        <text
          x={padX - 4}
          y={padTop + graphH}
          textAnchor="end"
          className="fill-muted/50"
          fontSize="8"
        >
          Low
        </text>

        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map((frac) => (
          <line
            key={frac}
            x1={padX}
            x2={padX + graphW}
            y1={padTop + graphH * frac}
            y2={padTop + graphH * frac}
            stroke="var(--card-border)"
            strokeWidth="0.5"
            strokeDasharray={frac === 0.5 ? "3,3" : "0"}
          />
        ))}

        {/* Secondary curve (faint) */}
        {secondaryPoints && (
          <>
            <path
              d={toAreaPath(secondaryPoints)}
              fill="url(#secondaryGrad)"
            />
            <path
              d={toPath(secondaryPoints)}
              fill="none"
              stroke="var(--violet)"
              strokeWidth="1.5"
              strokeOpacity="0.3"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Primary curve fill */}
        <path d={toAreaPath(points)} fill="url(#curveGrad)" />

        {/* Primary curve line */}
        <path
          d={toPath(points)}
          fill="none"
          stroke="var(--indigo)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* "Now" dot */}
        <circle cx={nowX} cy={nowY} r="4" fill="var(--indigo)" />
        <circle
          cx={nowX}
          cy={nowY}
          r="7"
          fill="none"
          stroke="var(--indigo)"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
        <text
          x={nowX}
          y={nowY - 10}
          textAnchor="middle"
          className="fill-indigo"
          fontSize="7"
          fontWeight="600"
        >
          now
        </text>

        {/* X-axis time labels */}
        {timeLabels.map((label, i) => {
          const x =
            padX + (i / (timeLabels.length - 1)) * graphW;
          return (
            <text
              key={label}
              x={x}
              y={height - 6}
              textAnchor="middle"
              className="fill-muted/50"
              fontSize="8"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
