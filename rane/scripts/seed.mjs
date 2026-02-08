import mongoose from "mongoose";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(".", ".env.local") });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

const EntrySchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true },
    reflection: { type: String, required: true },
    primaryWeather: { type: String, required: true },
    secondaryWeather: { type: String },
    explanation: { type: String, required: true },
    shelterSuggestions: [{ text: String, icon: String }],
    guardrails: { notIdeal: [String], betterSuited: [String] },
    closingMessage: { type: String, required: true },
    context: { sleepHours: Number, activityLevel: String, cyclePhase: String },
    userId: { type: String, index: true },
  },
  { timestamps: true }
);

const Entry = mongoose.model("Entry", EntrySchema);

const seedEntries = [
  {
    date: "2026-02-07",
    reflection:
      "I couldn\u2019t focus today. Every small thing felt like it needed all my energy. I kept staring at my to-do list and doing nothing. I think I\u2019m just tired of being tired.",
    primaryWeather: "fog",
    secondaryWeather: "low-tide",
    explanation:
      "Today feels like fog settling in. Mental energy may be low, especially after a demanding stretch and limited rest. There\u2019s also a quiet pull inward\u2014a low tide beneath the surface.",
    shelterSuggestions: [
      { text: "Couch mode: fully activated", icon: "\uD83D\uDECB\uFE0F" },
      { text: "Let someone else pick dinner", icon: "\uD83C\uDF55" },
      { text: "Doodle, scroll, or stare at a wall (all valid)", icon: "\uD83C\uDF3F" },
    ],
    guardrails: {
      notIdeal: ["Big decisions", "Self-evaluation", "New commitments"],
      betterSuited: ["Reflection", "Low-stakes tasks", "Saying no"],
    },
    closingMessage: "Nothing needs fixing today. This weather will pass.",
    context: { sleepHours: 5.5, activityLevel: "Low", cyclePhase: "Luteal" },
  },
  {
    date: "2026-02-06",
    reflection:
      "I woke up feeling okay but by afternoon everything felt overwhelming. A work email sent me spiraling. I snapped at my partner and then felt guilty about it all evening.",
    primaryWeather: "storms",
    secondaryWeather: "gusts",
    explanation:
      "Emotional storms moved in this afternoon. A small trigger may have released tension that was already building. The sudden shift suggests gusts\u2014sensitivity running high right now.",
    shelterSuggestions: [
      { text: "Reply to that email tomorrow (it can wait)", icon: "\uD83D\uDCEC" },
      { text: "Text a friend something silly", icon: "\uD83D\uDC9C" },
      { text: "Write it out, even if it's just angry scribbles", icon: "\uD83D\uDD8A\uFE0F" },
    ],
    guardrails: {
      notIdeal: ["Confrontations", "Big decisions", "Over-explaining yourself"],
      betterSuited: ["Quiet connection", "Saying no", "Gentle organization"],
    },
    closingMessage: "Storms don\u2019t mean something is wrong. They mean something is moving through.",
    context: { sleepHours: 6, activityLevel: "Moderate", cyclePhase: "Late Luteal" },
  },
  {
    date: "2026-02-05",
    reflection:
      "Today was actually peaceful. I took a long walk, had a slow morning. Didn\u2019t feel the need to rush. It\u2019s rare but I\u2019ll take it.",
    primaryWeather: "clear-skies",
    explanation:
      "Clear skies today. There\u2019s a sense of emotional ease and presence. This kind of clarity often comes when the body and mind get the space they need.",
    shelterSuggestions: [
      { text: "Bottle this feeling (figuratively)", icon: "\u2728" },
      { text: "Take the long way home", icon: "\uD83C\uDFF5\uFE0F" },
      { text: "Call that person you've been meaning to call", icon: "\uD83E\uDD1D" },
    ],
    guardrails: {
      notIdeal: ["Overcommitting", "Ignoring your own needs"],
      betterSuited: ["Planning with care", "Creative work", "Meaningful conversations"],
    },
    closingMessage: "You\u2019re allowed to enjoy the clear days too.",
  },
  {
    date: "2026-02-04",
    reflection:
      "I feel numb. Not sad exactly, just\u2026 empty. I went through the motions at work. Came home and just stared at the wall. I don\u2019t know what I need.",
    primaryWeather: "low-tide",
    explanation:
      "The tide is low today. Energy has pulled inward and that\u2019s okay. Sometimes the body protects itself by going quiet. This isn\u2019t failure\u2014it\u2019s conservation.",
    shelterSuggestions: [
      { text: "Blanket burrito mode", icon: "\uD83D\uDECB\uFE0F" },
      { text: "Put on that comfort show for the 100th time", icon: "\uD83C\uDF19" },
      { text: "Snacks count as self-care today", icon: "\uD83E\uDDF8" },
    ],
    guardrails: {
      notIdeal: ["Self-evaluation", "Major tasks", "Emotional conversations"],
      betterSuited: ["Gentle routine", "Rest", "Minimal expectations"],
    },
    closingMessage: "Nothing about this defines you. Low tide always returns to shore.",
    context: { sleepHours: 7, activityLevel: "Low" },
  },
  {
    date: "2026-02-03",
    reflection:
      "One minute I was fine, the next I was crying over a song. Then I was angry at myself for crying. It\u2019s like my emotions have no middle ground today.",
    primaryWeather: "gusts",
    explanation:
      "Gusts are blowing through today. Emotions may feel sudden and unpredictable\u2014shifting quickly between states. This often happens during times of heightened sensitivity.",
    shelterSuggestions: [
      { text: "Cry to the song again, honestly why not", icon: "\uD83C\uDF43" },
      { text: "Noise-canceling headphones are your friend", icon: "\uD83C\uDFA7" },
      { text: "Be as nice to yourself as you'd be to your dog", icon: "\uD83D\uDC9B" },
    ],
    guardrails: {
      notIdeal: ["Big decisions", "Confrontations", "Self-criticism"],
      betterSuited: ["Gentle journaling", "Breathing space", "Low-pressure tasks"],
    },
    closingMessage: "You\u2019re allowed to move gently today. The gusts will settle.",
    context: { sleepHours: 6.5, activityLevel: "Moderate", cyclePhase: "Follicular" },
  },
  {
    date: "2026-02-02",
    reflection:
      "Had brunch with a friend. Laughed a lot. The sun was out and I actually felt hopeful for the first time in a while. Maybe things are shifting.",
    primaryWeather: "clear-skies",
    explanation:
      "Clear skies are holding steady. Connection and rest seem to have opened up some emotional space. Hope is a sign the weather is lifting.",
    shelterSuggestions: [
      { text: "Send that 'thinking of you' text", icon: "\uD83D\uDC8C" },
      { text: "Make a playlist of today's vibe", icon: "\uD83C\uDFB6" },
      { text: "Treat yourself to that little thing", icon: "\uD83C\uDF3B" },
    ],
    guardrails: {
      notIdeal: ["Overthinking", "Forcing productivity"],
      betterSuited: ["Savoring", "Gentle planning", "Creative expression"],
    },
    closingMessage: "Let this warmth stay as long as it wants.",
  },
  {
    date: "2026-02-01",
    reflection:
      "I\u2019ve been carrying so much this week. Work deadlines, family stuff, barely sleeping. I feel like I\u2019m going to snap. Everything is too loud.",
    primaryWeather: "storms",
    explanation:
      "Storms are building from sustained pressure. When responsibility stacks up without relief, the emotional sky gets heavy. This isn\u2019t weakness\u2014it\u2019s overload.",
    shelterSuggestions: [
      { text: "'No' is a full sentence today", icon: "\uD83D\uDEE1\uFE0F" },
      { text: "Delegate like a CEO (even if it's just dishes)", icon: "\uD83E\uDD32" },
      { text: "Tomorrow-you can handle it, today-you rests", icon: "\uD83D\uDCE6" },
    ],
    guardrails: {
      notIdeal: ["People-pleasing", "Big decisions", "Emotional labor for others"],
      betterSuited: ["Protecting your energy", "Saying no", "Asking for space"],
    },
    closingMessage: "You\u2019ve been carrying a lot. It\u2019s okay to put something down.",
    context: { sleepHours: 4.5, activityLevel: "High", cyclePhase: "Menstrual" },
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected to:", mongoose.connection.db.databaseName);

  // Clear existing entries
  const deleted = await Entry.deleteMany({});
  console.log(`Cleared ${deleted.deletedCount} existing entries.`);

  // Insert seed entries with dev-user userId
  const entries = seedEntries.map((e) => ({ ...e, userId: "dev-user" }));
  const result = await Entry.insertMany(entries);
  console.log(`Seeded ${result.length} entries.`);

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
