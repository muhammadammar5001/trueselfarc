export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Record<string, number>;
  }[];
}

export const VARIABLES = ["Control", "Emotional Depth", "Social", "Risk", "Sacrifice"] as const;
export type Variable = (typeof VARIABLES)[number];

// 20 placeholder questions — replace text & scoring as needed
export const questions: Question[] = [
  {
    id: 1,
    text: "When plans change at the last minute, you usually…",
    options: [
      { label: "Adapt instantly", scores: { Risk: 3, Social: 1 } },
      { label: "Feel frustrated but go along", scores: { Control: 2, "Emotional Depth": 1 } },
      { label: "Take charge and redirect", scores: { Control: 3 } },
      { label: "Check on how others feel first", scores: { Sacrifice: 2, Social: 2 } },
    ],
  },
  {
    id: 2,
    text: "A close friend shares a secret. Your first instinct is to…",
    options: [
      { label: "Protect it at all costs", scores: { Sacrifice: 3, "Emotional Depth": 1 } },
      { label: "Analyze what it means", scores: { Control: 2 } },
      { label: "Share advice right away", scores: { Social: 2, Risk: 1 } },
      { label: "Feel deeply honored", scores: { "Emotional Depth": 3 } },
    ],
  },
  {
    id: 3,
    text: "You're at a party where you know nobody. You…",
    options: [
      { label: "Introduce yourself to everyone", scores: { Social: 3, Risk: 1 } },
      { label: "Find one person to talk to deeply", scores: { "Emotional Depth": 3 } },
      { label: "Observe from the sidelines", scores: { Control: 2 } },
      { label: "Leave early", scores: { Sacrifice: 1, Control: 1 } },
    ],
  },
  {
    id: 4,
    text: "When making a tough decision, you rely most on…",
    options: [
      { label: "Logic and analysis", scores: { Control: 3 } },
      { label: "Gut feeling", scores: { Risk: 2, "Emotional Depth": 2 } },
      { label: "What others think", scores: { Social: 2, Sacrifice: 1 } },
      { label: "Past experiences", scores: { "Emotional Depth": 2, Control: 1 } },
    ],
  },
  {
    id: 5,
    text: "Your ideal weekend looks like…",
    options: [
      { label: "A spontaneous adventure", scores: { Risk: 3, Social: 1 } },
      { label: "Quality time with loved ones", scores: { "Emotional Depth": 2, Sacrifice: 2 } },
      { label: "A perfectly planned schedule", scores: { Control: 3 } },
      { label: "Helping someone in need", scores: { Sacrifice: 3 } },
    ],
  },
  {
    id: 6,
    text: "When someone criticizes your work, you…",
    options: [
      { label: "Take it personally", scores: { "Emotional Depth": 3 } },
      { label: "Use it to improve", scores: { Control: 2, Risk: 1 } },
      { label: "Defend your position", scores: { Control: 2, Risk: 2 } },
      { label: "Ask others for their opinion", scores: { Social: 3 } },
    ],
  },
  {
    id: 7,
    text: "You find a wallet on the street. You…",
    options: [
      { label: "Return it immediately", scores: { Sacrifice: 3 } },
      { label: "Look for ID and contact them", scores: { Control: 2, Sacrifice: 1 } },
      { label: "Turn it in to the police", scores: { Control: 2 } },
      { label: "Post about it on social media", scores: { Social: 3 } },
    ],
  },
  {
    id: 8,
    text: "In a group project, you naturally become the…",
    options: [
      { label: "Leader", scores: { Control: 3 } },
      { label: "Mediator", scores: { Social: 2, Sacrifice: 2 } },
      { label: "Creative brain", scores: { Risk: 2, "Emotional Depth": 2 } },
      { label: "Reliable worker", scores: { Sacrifice: 2, Control: 1 } },
    ],
  },
  {
    id: 9,
    text: "What keeps you up at night?",
    options: [
      { label: "Unfinished tasks", scores: { Control: 3 } },
      { label: "Conversations I replayed", scores: { "Emotional Depth": 3, Social: 1 } },
      { label: "Exciting future plans", scores: { Risk: 2 } },
      { label: "Worrying about someone else", scores: { Sacrifice: 3 } },
    ],
  },
  {
    id: 10,
    text: "Your communication style is best described as…",
    options: [
      { label: "Direct and clear", scores: { Control: 3 } },
      { label: "Warm and empathetic", scores: { "Emotional Depth": 2, Sacrifice: 2 } },
      { label: "Energetic and expressive", scores: { Social: 3, Risk: 1 } },
      { label: "Thoughtful and reserved", scores: { "Emotional Depth": 3 } },
    ],
  },
  {
    id: 11,
    text: "When facing a fear, you tend to…",
    options: [
      { label: "Confront it head on", scores: { Risk: 3 } },
      { label: "Plan a safe approach", scores: { Control: 3 } },
      { label: "Talk about it with friends", scores: { Social: 2, "Emotional Depth": 1 } },
      { label: "Avoid it altogether", scores: { Sacrifice: 1 } },
    ],
  },
  {
    id: 12,
    text: "The trait you value most in others is…",
    options: [
      { label: "Honesty", scores: { Control: 1, "Emotional Depth": 2 } },
      { label: "Kindness", scores: { Sacrifice: 3 } },
      { label: "Courage", scores: { Risk: 3 } },
      { label: "Humor", scores: { Social: 3 } },
    ],
  },
  {
    id: 13,
    text: "When you feel overwhelmed, you…",
    options: [
      { label: "Make a list and organize", scores: { Control: 3 } },
      { label: "Seek comfort from someone", scores: { "Emotional Depth": 2, Social: 2 } },
      { label: "Do something reckless", scores: { Risk: 3 } },
      { label: "Put others first anyway", scores: { Sacrifice: 3 } },
    ],
  },
  {
    id: 14,
    text: "Your dream job would involve…",
    options: [
      { label: "Leading a team", scores: { Control: 3, Social: 1 } },
      { label: "Helping people directly", scores: { Sacrifice: 3 } },
      { label: "Creative expression", scores: { "Emotional Depth": 3 } },
      { label: "High-stakes challenges", scores: { Risk: 3 } },
    ],
  },
  {
    id: 15,
    text: "How do you handle conflict?",
    options: [
      { label: "Address it directly", scores: { Control: 2, Risk: 2 } },
      { label: "Try to keep the peace", scores: { Sacrifice: 2, Social: 2 } },
      { label: "Reflect on my feelings first", scores: { "Emotional Depth": 3 } },
      { label: "Seek a mediator", scores: { Social: 3 } },
    ],
  },
  {
    id: 16,
    text: "What describes your relationship with money?",
    options: [
      { label: "I budget everything", scores: { Control: 3 } },
      { label: "I spend on experiences", scores: { Risk: 2, Social: 2 } },
      { label: "I give generously", scores: { Sacrifice: 3 } },
      { label: "I invest emotionally in things", scores: { "Emotional Depth": 2 } },
    ],
  },
  {
    id: 17,
    text: "If you could have one superpower…",
    options: [
      { label: "Mind reading", scores: { Control: 3, "Emotional Depth": 1 } },
      { label: "Healing others", scores: { Sacrifice: 3 } },
      { label: "Invisibility", scores: { Risk: 2, "Emotional Depth": 2 } },
      { label: "Super charisma", scores: { Social: 3 } },
    ],
  },
  {
    id: 18,
    text: "When watching a sad movie, you…",
    options: [
      { label: "Cry openly", scores: { "Emotional Depth": 3 } },
      { label: "Hold back tears", scores: { Control: 2 } },
      { label: "Comfort whoever I'm with", scores: { Sacrifice: 2, Social: 2 } },
      { label: "Analyze the filmmaking", scores: { Control: 2, Risk: 1 } },
    ],
  },
  {
    id: 19,
    text: "People often come to you for…",
    options: [
      { label: "Advice and solutions", scores: { Control: 3 } },
      { label: "Emotional support", scores: { "Emotional Depth": 2, Sacrifice: 2 } },
      { label: "Fun and energy", scores: { Social: 3 } },
      { label: "A reality check", scores: { Risk: 2, Control: 1 } },
    ],
  },
  {
    id: 20,
    text: "Your life motto would be…",
    options: [
      { label: "Stay in control", scores: { Control: 3 } },
      { label: "Feel everything deeply", scores: { "Emotional Depth": 3 } },
      { label: "Live on the edge", scores: { Risk: 3 } },
      { label: "Others before self", scores: { Sacrifice: 3 } },
    ],
  },
];

export type Archetype = {
  name: string;
  emoji: string;
  description: string;
  rarity: string;
};

export function getArchetype(scores: Record<string, number>): Archetype {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = sorted[0][0];
  const second = sorted[1][0];

  const archetypes: Record<string, Archetype> = {
    "Control": {
      name: "The Architect",
      emoji: "🏗️",
      description: "You build worlds with precision. Order is your art, and mastery is your mission.",
      rarity: "Top 8%",
    },
    "Emotional Depth": {
      name: "The Mirror",
      emoji: "🪞",
      description: "You feel what others can't name. Your depth is your superpower — and your weight.",
      rarity: "Top 5%",
    },
    "Social": {
      name: "The Spark",
      emoji: "⚡",
      description: "You light up rooms and connect souls. People orbit around your warmth.",
      rarity: "Top 12%",
    },
    "Risk": {
      name: "The Wildcard",
      emoji: "🃏",
      description: "You chase the unknown with open arms. Comfort zones bore you — chaos is your canvas.",
      rarity: "Top 3%",
    },
    "Sacrifice": {
      name: "The Guardian",
      emoji: "🛡️",
      description: "You carry others before yourself. Loyalty isn't a choice — it's your identity.",
      rarity: "Top 6%",
    },
  };

  const base = archetypes[top];

  // Blend with second trait for uniqueness
  const blends: Record<string, string> = {
    "Control+Emotional Depth": "The Calculated Heart",
    "Control+Social": "The Social Strategist",
    "Control+Risk": "The Mastermind",
    "Control+Sacrifice": "The Silent Pillar",
    "Emotional Depth+Control": "The Poetic Analyst",
    "Emotional Depth+Social": "The Empath",
    "Emotional Depth+Risk": "The Romantic Rebel",
    "Emotional Depth+Sacrifice": "The Healer",
    "Social+Control": "The Charming Commander",
    "Social+Emotional Depth": "The Soul Connector",
    "Social+Risk": "The Life of the Party",
    "Social+Sacrifice": "The Selfless Host",
    "Risk+Control": "The Calculated Daredevil",
    "Risk+Emotional Depth": "The Passionate Nomad",
    "Risk+Social": "The Thrill Seeker",
    "Risk+Sacrifice": "The Noble Rebel",
    "Sacrifice+Control": "The Quiet Hero",
    "Sacrifice+Emotional Depth": "The Eternal Giver",
    "Sacrifice+Social": "The People's Champion",
    "Sacrifice+Risk": "The Brave Protector",
  };

  const blendKey = `${top}+${second}`;
  const blendName = blends[blendKey] || base.name;

  return {
    ...base,
    name: blendName,
    rarity: base.rarity,
  };
}
