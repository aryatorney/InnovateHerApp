# Rane — Mental Ease Graph (Productivity Reframed)

## Purpose
This feature visualizes **mental ease over the course of a day**, not productivity or output.
The goal is to help users *observe* how their inner weather may rise and fall, without implying
performance expectations, obligation, or self-evaluation.

The graph externalizes mental load as a **weather-like pattern**, reinforcing Rane’s core philosophy:
mental states are temporary conditions, not personal failures.

---

## Naming & Framing (Non-Negotiable)

**Do NOT call this a productivity graph.**

Approved names:
- Mental Ease Curve
- Cognitive Load Curve
- Inner Weather Through the Day
- Energy & Ease Pattern

### What the Graph Represents
- Relative mental ease vs. strain
- Observational, not predictive
- Interpretive, not diagnostic

### What It Does NOT Represent
- Output
- Efficiency
- Value
- Success
- Obligation

---

## Graph Structure

### Axes
- **X-axis:** Time of day (Morning → Night)
- **Y-axis:** Mental ease (Low ↔ High)

Values are **relative and internal** (e.g., 0.2–0.8).  
Users never see numbers — only the visual curve.

---

## Data Inputs (Already Available)

No external datasets are used.

Inputs:
- Primary inner weather
- Secondary inner weather (optional)
- Sleep duration (if available)
- Emotional intensity inferred from reflection language

This keeps the system:
- Cost-free
- Explainable
- Ethical
- Hackathon-safe

---

## Step 1: Base Curve Templates (Static, App-Owned)

Each inner weather type has a **predefined curve shape**.
These are illustrative, not biological or medical.

| Inner Weather | Curve Characteristics |
|--------------|----------------------|
| 🌫 Fog        | Lower baseline, gradual dips, heavier later hours |
| 🌩 Storm     | Volatile rises and drops |
| 🌊 Low Tide  | Flat, low-energy curve |
| ☀️ Clear Skies | Gentle rise, stable plateau, soft decline |
| 🌬 Gusts     | Sharp fluctuations |

These templates live in code as static arrays or functions.

---

## Step 2: Gentle Modifiers

Modifiers slightly adjust the base curve.
They **never create extreme changes**.

### Examples
- **Low sleep:** cap maximum ease
- **High emotional intensity:** increase volatility
- **Clear skies + rest:** smooth transitions

Pseudocode example:
```ts
curveHeight *= sleepFactor
volatility += emotionalIntensity
