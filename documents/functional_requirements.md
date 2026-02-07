# Rane — Functional Flow & System Behavior (Revised)

## INPUTS

### Input 1: Daily Reflection
- User writes freely about their day
- No mood labels
- No sliders or ratings
- Natural language only
- Supports:
  - Text (MVP)
  - Voice (future / optional)

---

### Input 2: Health & Context Data (Optional, With Consent)

Pulled from Apple Health / Google Fit **or manual entry**:

- Sleep duration & consistency
- Activity / movement level
- Heart rate variability (if available)
- Menstrual cycle phase
  - Manual entry supported
  - Sync shown as future capability

**Constraints**
- Health data is used for *contextual framing only*
- No predictions, diagnoses, or optimization scoring
- If health data is unavailable, system still functions fully

---

## WHAT RANE DOES

### 1. Interpret the Reflection

Gemini analyzes the reflection for:
- Dominant emotional tone
- Secondary emotional signals
- Cognitive strain level
- Stress pattern:
  - Overload
  - Rumination
  - Withdrawal
  - Sensitivity

**Important**
- Analysis focuses on *patterns*, not labels
- Language is probabilistic (“may,” “often,” “tends to”)

---

### 2. Translate into Inner Weather

Emotions are mapped to metaphorical **inner weather states**:

- 🌩 Emotional Storms → overwhelm, anxiety, irritability
- 🌫 Fog → mental fatigue, indecision
- 🌊 Low Tide → withdrawal, numbness, inward energy
- 🌬 Gusts → sensitivity, sudden mood shifts
- ☀️ Clear Skies → clarity, emotional ease

**Rules**
- One **primary** weather state per day
- One **secondary** weather state allowed (optional)
- Weather represents *temporary conditions*, not identity

---

### 3. Add Context (If Health Data Exists)

Gemini checks for:
- Low or inconsistent sleep
- Low physical energy
- Cycle-related sensitivity patterns

Purpose:
- Frame emotions as **situational and temporary**
- Reduce self-blame narratives
- Increase self-compassion and understanding

---

## OUTPUTS — WHAT THE USER SEES

### Output 1: Today’s Inner Weather
- Visual weather card
- Primary weather state
- Optional secondary state
- Short, human-readable explanation (2–3 sentences)

Example:
> “Today feels like fog settling in. Mental energy may be low, especially after a demanding stretch and limited rest.”

---

### Output 2: Shelter Suggestions
Gentle, situational support aligned to weather state.

Examples:
- Rest
- Boundary-setting
- Reducing decisions
- Emotional validation
- Gentle expression (journaling, movement, quiet connection)

**Constraints**
- No “shoulds”
- No productivity framing
- Suggestions are optional, not directives

---

### Output 3: Decision Guardrails
Temporary guidance based on inner weather conditions.

**Purpose**
- Help users avoid impulsive or high-stakes decisions during difficult conditions
- Encourage self-protection, not restriction

Example:

**Not ideal today for:**
- Big decisions
- Confrontations
- Self-evaluation

**Better suited for:**
- Reflection
- Low-stakes tasks
- Saying no

---

### Output 4: Mood-Adaptive Closing Message
- One short emotionally tuned message
- Tone matches inner weather
- Purpose:
  - Validation
  - Grounding
  - Emotional safety

Example:
> “Nothing needs fixing today. This weather will pass.”

---

## RANE WORKFLOW

### 1. App Start
- User opens Rane
- Sees calm prompt:
  > “What’s on your mind today?”

---

### 2. User Inputs

#### Active Input
- User writes a free-form reflection
- No mood labels
- No ratings
- Natural language only

#### Passive Context Input (Optional)
- App pulls (with consent):
  - Sleep hours
  - Activity level
  - HRV (if available)
  - Menstrual cycle phase / day

---

### 3. Pre-Processing
- Reflection text + available context packaged together
- No personal identifiers included
- Data sent securely to Gemini

---

### 4. Gemini Interpretation
Gemini analyzes:
- Emotional signals
- Cognitive load
- Self-talk tone
- Stress patterns

Gemini combines:
- Text signals
- Energy context
- Cycle phase sensitivity

---

### 5. Inner Weather Generation
Gemini outputs:
- Primary inner weather state
- Secondary state (optional)

Supported states:
- 🌩 Emotional Storms
- 🌫 Fog
- 🌊 Low Tide
- 🌬 Gusts
- ☀️ Clear Skies

---

### 6. Meaning & Explanation
Gemini generates:
- 2–3 sentence compassionate explanation
- Non-clinical, non-judgmental language
- Emphasizes temporary conditions, not personal failure

---

### 7. Shelter Suggestions
Gemini selects 1–3 gentle shelter actions based on:
- Inner weather
- Energy context
- Cycle phase (if available)

Examples:
- Rest
- Reduce decisions
- Set boundaries
- Emotional validation
- Gentle expression

---

### 8. Decision Guardrails
Gemini generates:
- “Not ideal today for…”
- “Better suited today for…”

Purpose:
- Reduce impulsivity
- Support emotional safety
- Preserve user agency

---

### 9. Mood-Adaptive Closing Message
Gemini outputs:
- One short message
- Tone aligned to weather state
- Reinforces self-compassion

---

### 10. UI Display
App displays:
- Inner weather visuals
- Explanation text
- Shelter suggestions
- Decision guardrails
- Closing message

---

### 11. Save Entry
App stores:
- Reflection
- Weather states
- Context data (if provided)
- Generated insights

Entry added to user’s timeline.

---

### 12. Pattern Tracking (Lightweight)
- App compares entries across days
- Identifies repeating inner weather patterns
- Links patterns to:
  - Energy levels
  - Responsibility load
  - Cycle phase

---

### 13. Pattern Insights Output
Gemini generates human-readable insights such as:
- “Storms tend to appear after prolonged responsibility.”
- “Fog often follows low-sleep days during late cycle phases.”

---

## ETHICAL & SAFETY CONSTRAINTS
- Rane is not a diagnostic or therapeutic tool
- No medical advice is given
- No predictions or guarantees
- User agency is always preserved
