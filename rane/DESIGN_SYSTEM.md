# Rane Design System

> Inner weather for emotional clarity

---

## Brand Identity

**Name:** Rane
**Tagline:** Inner weather for emotional clarity
**Philosophy:** Rane maps emotional states to weather metaphors — turning journaling into clarity, not self-blame. The design language should feel soft, safe, and non-judgmental. Nothing clinical. Nothing gamified.

**Voice:** Warm, poetic, grounded. Never diagnostic. Always preserving user agency.

---

## Color Palette

### Core Colors

| Token           | Hex       | RGB               | Usage                                      |
|-----------------|-----------|-------------------|--------------------------------------------|
| `--indigo`      | `#5B34A3` | `91, 52, 163`     | Primary brand, buttons, active states, links |
| `--violet`      | `#9F51B7` | `159, 81, 183`    | Secondary accent, guardrail "not ideal" labels |
| `--blush`       | `#EAA2CA` | `234, 162, 202`   | Gentle nudges label, gusts weather          |
| `--sky-blue`    | `#9AC3FF` | `154, 195, 255`   | Fog weather, secondary accents              |
| `--sand`        | `#EFD695` | `239, 214, 149`   | Warm gradient endpoints                     |
| `--sunlight`    | `#F5E487` | `245, 228, 135`   | Clear skies weather                         |
| `--peach`       | `#FFD9D2` | `255, 217, 210`   | Gusts gradient endpoint                     |

### Surface Colors

| Token             | Hex       | Usage                              |
|-------------------|-----------|------------------------------------|
| `--background`    | `#F8F6FC` | App background, splash screen      |
| `--foreground`    | `#2D2248` | Primary text                       |
| `--muted`         | `#8E82A6` | Secondary text, labels, timestamps |
| `--card`          | `#FFFFFF` | Card backgrounds                   |
| `--card-border`   | `#E8E2F4` | Card borders, dividers, scrollbar  |

### Opacity Patterns

- `text-foreground/80` — Body text in cards
- `text-foreground/70` — List items, secondary content
- `text-muted/70` — Weekday headers, subtle labels
- `text-muted/60` — Italic quotes, disclaimer text
- `text-muted/50` — Chart axis labels
- `text-muted/30` — Future dates (calendar)
- `bg-indigo/10` — Subtle indigo background (buttons, badges)
- `bg-indigo/30` — Weather gradient start (storms)
- `bg-card/60` — Frosted card overlay (explanation block)
- `bg-card/80` — Navigation bar background (with backdrop-blur)

---

## Typography

### Font

**Primary:** Inter (Google Fonts)
**Fallback:** system-ui, sans-serif
**Loading:** `next/font/google` with `--font-inter` CSS variable
**Rendering:** `antialiased`

### Scale

| Element               | Size     | Weight       | Tracking        | Example Usage                     |
|-----------------------|----------|-------------|-----------------|-----------------------------------|
| Page title            | `text-2xl` (24px) | `font-semibold` (600) | —           | "Settings", "Timeline"            |
| Brand name            | `text-4xl` (36px) | `font-bold` (700)     | `tracking-tight` | "Rane" on auth page             |
| Section heading       | `text-xl` (20px)  | `font-semibold` (600) | —           | Weather label ("Fog")             |
| Card heading          | `text-sm` (14px)  | `font-semibold` (600) | `tracking-wide` + `uppercase` | "DECISION GUARDRAILS" |
| Body text             | `text-sm` (14px)  | `font-normal` (400)   | —           | Reflections, explanations         |
| Small text            | `text-xs` (12px)  | `font-medium` (500)   | —           | Badge labels, subtle labels       |
| Tiny text             | `text-[10px]`     | `font-medium` (500)   | —           | Weekday headers, calendar legend  |
| Closing quote         | `text-lg` (18px)  | `font-medium` (500)   | —           | Closing message (italic)          |
| Chart labels          | `8px` (SVG)       | —                     | —           | Time axis, Y-axis labels          |

### Line Heights

- `leading-relaxed` — Reflections, body paragraphs, disclaimers
- `leading-tight` — List items in guardrails
- `leading-none` — Weather emoji in calendar cells

---

## Weather System

### States

| State          | Emoji  | Asset        | Label            | Description                         | Color       |
|----------------|--------|-------------|------------------|-------------------------------------|-------------|
| `storms`       | ⛈️     | `/storm.png` | Emotional Storms | Overwhelm, anxiety, irritability    | `#5B34A3`   |
| `fog`          | 🌫️    | `/foggy.png` | Fog              | Mental fatigue, indecision          | `#9AC3FF`   |
| `low-tide`     | 🌊     | —           | Low Tide         | Withdrawal, numbness, inward energy | `#9F51B7`   |
| `gusts`        | 🌬️    | `/gust.png`  | Gusts            | Sensitivity, sudden mood shifts     | `#EAA2CA`   |
| `clear-skies`  | ☀️     | —           | Clear Skies      | Clarity, emotional ease             | `#F5E487`   |

### Weather Gradients (Card Backgrounds)

Each weather state uses a gradient background on its card:

| State         | Gradient                                     |
|---------------|----------------------------------------------|
| `storms`      | `from-indigo/30 to-violet/20`                |
| `fog`         | `from-sky-blue/30 to-card-border/20`         |
| `low-tide`    | `from-violet/20 to-sky-blue/20`              |
| `gusts`       | `from-blush/30 to-peach/20`                  |
| `clear-skies` | `from-sunlight/30 to-sand/20`                |

### Calendar Ombre Overlays

Each day cell in the weather calendar uses a 135deg linear gradient:

| State         | From                              | To                                |
|---------------|-----------------------------------|-----------------------------------|
| `storms`      | `rgba(91, 52, 163, 0.5)`         | `rgba(159, 81, 183, 0.2)`        |
| `fog`         | `rgba(154, 195, 255, 0.5)`       | `rgba(232, 226, 244, 0.2)`       |
| `low-tide`    | `rgba(159, 81, 183, 0.4)`        | `rgba(154, 195, 255, 0.15)`      |
| `gusts`       | `rgba(234, 162, 202, 0.45)`      | `rgba(255, 217, 210, 0.2)`       |
| `clear-skies` | `rgba(245, 228, 135, 0.55)`      | `rgba(239, 214, 149, 0.2)`       |

---

## Spacing & Layout

### Page Structure

- **Max content width:** `max-w-lg` (512px) — all main content is centered within this
- **Page padding:** `px-6` horizontal, `pt-8 pb-2` header, `pt-4` main content
- **Bottom padding:** `pb-24` — accounts for fixed bottom navigation
- **Section gap:** `space-y-6` between major content blocks

### Card Spacing

- **Padding:** `p-5` (standard cards), `p-6` (featured cards like weather, auth)
- **Inner spacing:** `space-y-4` between form elements, `space-y-3` between list items
- **Margin bottom between cards:** `mb-4` to `mb-6`

---

## Border Radius

| Element            | Radius          | Tailwind Class  |
|--------------------|-----------------|-----------------|
| Feature cards      | 24px            | `rounded-3xl`   |
| Standard cards     | 16px            | `rounded-2xl`   |
| Buttons            | 12px            | `rounded-xl`    |
| Pill buttons       | 9999px          | `rounded-full`  |
| Calendar day cells | 12px            | `rounded-xl`    |
| Context badges     | 9999px          | `rounded-full`  |
| Input fields       | 16px            | `rounded-2xl`   |
| Toggle switches    | 9999px          | `rounded-full`  |
| Nav tab buttons    | 12px            | `rounded-xl`    |

---

## Components

### Buttons

**Primary (filled):**
```
bg-indigo text-white rounded-xl py-2.5 text-sm font-medium
hover:bg-indigo/90 transition-all
```

**Secondary (outline):**
```
border border-card-border rounded-xl py-2.5 text-sm font-medium text-foreground/70
hover:bg-background transition-all
```

**Pill (small):**
```
rounded-full bg-indigo px-6 py-2 text-sm font-medium text-white
hover:bg-indigo/90 disabled:opacity-40 disabled:cursor-not-allowed
```

**Learn Why (inline):**
```
rounded-full bg-indigo/10 px-3 py-1 text-xs font-medium text-indigo
hover:bg-indigo/20 transition-colors
```

### Cards

**Standard card:**
```
rounded-2xl border border-card-border bg-card p-5
```

**Feature card (weather, auth):**
```
rounded-3xl border border-card-border bg-gradient-to-br {weather.bgGradient} p-6
```

**Closing message card:**
```
rounded-2xl bg-gradient-to-br from-indigo/10 to-violet/10 p-6 text-center
```

### Context Badges

```
inline-flex items-center gap-1.5 rounded-full border border-card-border
bg-card px-3 py-1 text-xs text-muted
```

Displayed as a horizontal `flex flex-wrap gap-2` row. Each badge has an emoji icon + label.

### Toggle Switches

```
relative h-6 w-11 rounded-full transition-colors
Active: bg-indigo
Inactive: bg-card-border
Thumb: absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm
Active thumb: translate-x-5
```

### Input Fields

**Text area:**
```
w-full resize-none rounded-2xl border border-card-border bg-background/50
px-4 py-3 text-sm leading-relaxed text-foreground
placeholder:text-muted/60
focus:border-indigo/40 focus:outline-none focus:ring-2 focus:ring-indigo/10
```

**Text input:**
```
w-full rounded-xl border border-card-border bg-background/50
px-4 py-2.5 text-sm
placeholder:text-muted/50
focus:border-indigo/40 focus:outline-none focus:ring-2 focus:ring-indigo/10
```

### Navigation Bar (Bottom)

```
fixed bottom-0 left-0 right-0 z-50
border-t border-card-border bg-card/80 backdrop-blur-lg
```

- 3 items: Today (sun icon), Timeline (calendar icon), Settings (gear icon)
- Active state: `text-indigo` with filled icon
- Inactive state: `text-muted` with stroke-only icon
- Icon size: 22x22, stroke-width 1.8
- Label: `text-xs font-medium`
- Container: `max-w-lg mx-auto flex justify-around py-2`

---

## Iconography

### Navigation Icons

All icons are custom inline SVGs with consistent properties:
- **Size:** 22x22
- **Stroke width:** 1.8
- **Stroke line cap:** round
- **Stroke line join:** round
- **Active state:** `fill="currentColor"` (solid)
- **Inactive state:** `fill="none"` (outline only)

| Icon     | Description                  | Usage         |
|----------|------------------------------|---------------|
| Sun      | Circle with radiating lines  | Today tab     |
| Calendar | Rect with date lines         | Timeline tab  |
| Gear     | Cog wheel with center circle | Settings tab  |

### Weather Icons

Weather states use either custom PNG assets (from `/public/`) or emoji fallbacks:
- Assets render via `next/image` at various sizes (32px compact, 120px featured)
- Emoji fallbacks: `text-2xl` (compact), `text-5xl` (featured)

---

## Animations & Transitions

### Splash Screen

- **Duration:** 1 second of video playback
- **Fade out:** 700ms opacity transition
- **Background:** `bg-background` (#F8F6FC) — matches app background
- **Video:** `object-contain`, full height, centered

### Card Flip (Decision Guardrails)

- **Perspective:** `1000px`
- **Flip duration:** 700ms
- **Transform:** `rotateY(180deg)`
- **Both sides:** `backface-visibility: hidden`

### General Transitions

- `transition-all` — buttons, interactive elements
- `transition-colors` — nav items, toggle switches
- `hover:scale-105` — calendar day cells with entries
- `hover:shadow-md` — calendar day cells on hover
- `animate-pulse` — loading skeletons, "Reading the weather..." state

---

## Charts (Productivity Possibilities)

### SVG Graph

- **Viewport:** 320x140
- **Padding:** 32px horizontal, 16px top, 28px bottom
- **Curve type:** Cubic bezier (smooth)
- **Primary curve stroke:** `var(--indigo)`, width 2
- **Primary fill:** Linear gradient from `indigo/25%` to `indigo/2%`
- **Secondary curve stroke:** `var(--violet)`, width 1.5, opacity 0.3
- **Secondary fill:** Linear gradient from `violet/12%` to `violet/1%`
- **"Now" marker:** Filled circle (r=4) with outer ring (r=7, opacity 0.3), both `var(--indigo)`
- **Grid lines:** `var(--card-border)`, width 0.5, middle line dashed
- **Axis labels:** 8px, `fill-muted/50`
- **Time labels:** 6am, 9am, 12pm, 3pm, 6pm, 9pm

### Weather Calendar

- **Grid:** 7 columns, gap-1
- **Day cell:** `aspect-square rounded-xl text-xs font-medium`
- **Today marker:** `ring-2 ring-indigo/50` with bold indigo text
- **Future dates:** `text-muted/30`
- **Legend:** Centered row of color dots (h-2.5 w-2.5 rounded-full) + emoji + label

---

## Scrollbar

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--card-border); border-radius: 3px; }
```

---

## Responsive Behavior

- **Target:** Mobile-first (max-w-lg centered content)
- **Content area:** 512px max width, centered with `mx-auto`
- **Navigation:** Full-width fixed bottom bar
- **Cards:** Full width within content area
- **Calendar:** 7-column grid scales with container
- **SVG charts:** `w-full` with `preserveAspectRatio="xMidYMid meet"`

---

## Data Types

```typescript
type WeatherState = "storms" | "fog" | "low-tide" | "gusts" | "clear-skies";

interface WeatherInfo {
  id: WeatherState;
  label: string;
  emoji: string;
  asset?: string;       // Optional PNG path in /public/
  description: string;
  color: string;        // Hex color for the weather state
  bgGradient: string;   // Tailwind gradient classes
}

interface DayEntry {
  date: string;                    // "YYYY-MM-DD"
  reflection: string;              // User's journal text
  primaryWeather: WeatherState;
  secondaryWeather?: WeatherState;
  explanation: string;             // AI-generated weather explanation
  shelterSuggestions: ShelterSuggestion[];
  guardrails: DecisionGuardrail;
  closingMessage: string;
  context?: {
    sleepHours?: number;
    activityLevel?: string;        // "Low" | "Moderate" | "High"
    cyclePhase?: string;           // "Menstrual" | "Follicular" | "Ovulatory" | "Luteal" | "Late Luteal"
  };
}

interface ShelterSuggestion {
  text: string;   // Lighthearted, non-prescriptive
  icon: string;   // Emoji
}

interface DecisionGuardrail {
  notIdeal: string[];      // Things to avoid today
  betterSuited: string[];  // Things that align with current energy
}
```

---

## File Structure

```
src/
├── app/
│   ├── globals.css          # CSS variables, Tailwind theme, scrollbar
│   ├── layout.tsx           # Root layout (Inter font, Auth0Provider, AppShell)
│   ├── page.tsx             # Redirects to /today
│   ├── auth/page.tsx        # Auth landing page
│   ├── today/page.tsx       # Today's weather report
│   ├── timeline/page.tsx    # Weather calendar + pattern insight
│   ├── settings/page.tsx    # User profile, toggles, privacy info
│   └── day/[date]/page.tsx  # Historical day report
├── components/
│   ├── AppShell.tsx         # Wraps children with SplashScreen
│   ├── SplashScreen.tsx     # 1-second video splash with fade
│   ├── Navigation.tsx       # Bottom tab bar (Today, Timeline, Settings)
│   ├── WeatherCard.tsx      # Weather display (compact + full)
│   ├── ContextBadge.tsx     # Sleep/activity/cycle pills
│   ├── ReflectionInput.tsx  # Journal text area with submit
│   ├── DecisionGuardrails.tsx # Flippable guardrails card + suggestions
│   ├── MentalEaseCurve.tsx  # Productivity Possibilities SVG graph
│   ├── WeatherCalendar.tsx  # Monthly calendar with weather overlays
│   └── ClosingMessage.tsx   # Italic quote card
├── lib/
│   ├── auth0.ts             # Auth0Client singleton
│   ├── types.ts             # TypeScript type definitions
│   └── mockData.ts          # Weather map + 7 mock entries
└── middleware.ts             # Auth0 route handling + route protection
```

---

## Accessibility Notes

- All interactive elements have hover states
- Focus rings use `focus:ring-2 focus:ring-indigo/10` (subtle but visible)
- Weather states have both emoji and text labels (not color-only)
- Calendar legend pairs color dots with emoji + text
- Navigation icons use both icon + text label
- High contrast: foreground `#2D2248` on background `#F8F6FC` (ratio ~8.5:1)

---

## Disclaimer Pattern

Appears on auth page and settings:
```
text-center text-xs leading-relaxed text-muted/70
```

Standard text: *"Rane is not a diagnostic or therapeutic tool. Your reflections are private and treated with care."*

Extended (settings): *"Rane is not a diagnostic or therapeutic tool. No medical advice is given. No predictions or guarantees. Your agency is always preserved."*
