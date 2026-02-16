export interface Question {
  id: number;
  text: string;
  phase?: string;
  options: {
    label: string;
    scores: Record<string, number>;
  }[];
}

export const VARIABLES = ["CS", "ED", "SE", "RO", "LS"] as const;
export const VARIABLE_LABELS: Record<string, string> = {
  CS: "Control & Structure",
  ED: "Emotional Depth",
  SE: "Social Energy",
  RO: "Risk Orientation",
  LS: "Love & Sacrifice",
};
export type Variable = (typeof VARIABLES)[number];

export const questions: Question[] = [
  // Phase 1: The Scenarios
  {
    id: 1,
    phase: "The Scenarios",
    text: "You are planning a 5-day vacation with friends. What is your role?",
    options: [
      { label: "I create a spreadsheet with an hour-by-hour itinerary.", scores: { CS: 3 } },
      { label: "I book the flights and hotel, but we figure out the rest when we get there.", scores: { CS: 1, RO: 1 } },
      { label: "I don't plan anything; I just show up and follow the group vibe.", scores: { CS: -2, SE: 1 } },
      { label: "I actively look for dangerous or adrenaline-filled activities for us to do.", scores: { RO: 3 } },
      { label: "I worry about everyone else having a good time and compromise on what I want to do.", scores: { LS: 3 } },
    ],
  },
  {
    id: 2,
    phase: "The Scenarios",
    text: "A close friend calls you at 2 AM crying about a breakup. You have a big meeting at 8 AM. You:",
    options: [
      { label: "Answer immediately and talk for hours; the meeting doesn't matter right now.", scores: { LS: 3, ED: 2 } },
      { label: "Answer, listen for 15 minutes, then firmly tell them we need to sleep and talk tomorrow.", scores: { CS: 2, LS: 1 } },
      { label: "Don't answer. I need my sleep to perform well.", scores: { CS: 1, LS: -2 } },
      { label: "Text them: \"Come over right now,\" even if it ruins my sleep schedule.", scores: { RO: 1, LS: 2 } },
      { label: "Feel their pain so deeply that I can't sleep anyway, even if I don't answer.", scores: { ED: 3 } },
    ],
  },
  {
    id: 3,
    phase: "The Scenarios",
    text: "You suddenly win $50,000. What is the very first thing you do?",
    options: [
      { label: "Put 100% of it into a high-yield savings account or index fund.", scores: { CS: 3, RO: -2 } },
      { label: "Buy a wildly expensive gift for my partner or parents.", scores: { LS: 3 } },
      { label: "Invest half in crypto or a startup, and travel with the rest.", scores: { RO: 3 } },
      { label: "Throw a massive party for everyone I know.", scores: { SE: 3 } },
      { label: "Feel anxious about the responsibility and don't touch it for months.", scores: { ED: 2, RO: -1 } },
    ],
  },
  {
    id: 4,
    phase: "The Scenarios",
    text: "You walk into a room full of strangers at a networking event. You:",
    options: [
      { label: "Find one person standing alone and have a deep conversation.", scores: { SE: -1, ED: 2 } },
      { label: "Work the room, trying to meet as many people as possible.", scores: { SE: 3 } },
      { label: "Stand near the food/bar and wait for someone to approach me.", scores: { SE: -2 } },
      { label: "Observe the room layout and dynamics before making a calculated move.", scores: { CS: 2 } },
      { label: "Feel a rush of excitement and jump into the center of the loudest group.", scores: { RO: 2, SE: 2 } },
    ],
  },
  {
    id: 5,
    phase: "The Scenarios",
    text: "Your boss gives you a project with vague instructions and no deadline. You feel:",
    options: [
      { label: "Paralyzed. I need clear rules to function.", scores: { CS: 3 } },
      { label: "Excited. I can do whatever I want with this!", scores: { CS: -2, RO: 2 } },
      { label: "Annoyed. I'll create my own structure immediately to fix the mess.", scores: { CS: 2 } },
      { label: "Indifferent. I'll do the bare minimum until they ask for it.", scores: { SE: -1 } },
      { label: "Worried I will disappoint them if I guess wrong.", scores: { ED: 2, LS: 1 } },
    ],
  },
  // Phase 2: The Inner World
  {
    id: 6,
    phase: "The Inner World",
    text: "When you watch a deeply tragic movie, you:",
    options: [
      { label: "Cry openly; it affects my mood for the rest of the day.", scores: { ED: 3 } },
      { label: "Get a lump in my throat but hide it.", scores: { ED: 1, CS: 1 } },
      { label: "Analyze the cinematography and acting; I don't get that emotional.", scores: { ED: -2 } },
      { label: "Feel uncomfortable and prefer to crack a joke to lighten the mood.", scores: { ED: -1, SE: 1 } },
      { label: "Focus on how I would have fixed the characters' problems.", scores: { CS: 2 } },
    ],
  },
  {
    id: 7,
    phase: "The Inner World",
    text: "Which of these fears is most potent for you?",
    options: [
      { label: "Being trapped in a boring routine forever.", scores: { RO: 3 } },
      { label: "Chaos and losing control of my environment.", scores: { CS: 3 } },
      { label: "Being abandoned or unloved by those I care about.", scores: { LS: 3, ED: 1 } },
      { label: "Being humiliated publicly.", scores: { SE: 1, ED: 1 } },
      { label: "Hurting someone else's feelings unintentionally.", scores: { LS: 2, ED: 2 } },
    ],
  },
  {
    id: 8,
    phase: "The Inner World",
    text: "It's Friday night. Your ideal evening is:",
    options: [
      { label: "A rowdy club or bar hopping with a big crew.", scores: { SE: 3, RO: 1 } },
      { label: "A structured game night with clear rules and a timeline.", scores: { CS: 2, SE: 1 } },
      { label: "A deep, one-on-one conversation with a partner over wine.", scores: { ED: 2, SE: -1 } },
      { label: "Staying home alone to work on a personal project.", scores: { SE: -2, CS: 1 } },
      { label: "Doing something spontaneous—driving to a new city with no map.", scores: { RO: 3 } },
    ],
  },
  {
    id: 9,
    phase: "The Inner World",
    text: "In a romantic relationship, what is the biggest dealbreaker?",
    options: [
      { label: "Clinginess. I need my space.", scores: { LS: -2, SE: -1 } },
      { label: "Unpredictability. I need to know where we stand 24/7.", scores: { CS: 3 } },
      { label: "Lack of passion. If we aren't obsessed with each other, why bother?", scores: { ED: 3 } },
      { label: "Selfishness. If they won't sacrifice for me, I'm out.", scores: { LS: 3 } },
      { label: "Boredom. I can't stand a \"normal\" life.", scores: { RO: 2 } },
    ],
  },
  {
    id: 10,
    phase: "The Inner World",
    text: "You make a mistake at work that costs the company money. You:",
    options: [
      { label: "Immediately confess and offer to pay it back or work late to fix it.", scores: { LS: 2, CS: 1 } },
      { label: "Hide it and hope no one notices.", scores: { RO: 1, LS: -1 } },
      { label: "Blame the system for being unclear.", scores: { CS: -1 } },
      { label: "Feel crushing guilt and replay the mistake in my head for weeks.", scores: { ED: 3 } },
      { label: "Shrug it off. \"You have to break eggs to make an omelet.\"", scores: { RO: 2, ED: -2 } },
    ],
  },
  // Phase 3: The Hard Choices
  {
    id: 11,
    phase: "The Hard Choices",
    text: "Which word best describes your bedroom right now?",
    options: [
      { label: "Minimalist and perfectly organized.", scores: { CS: 3 } },
      { label: "Organized chaos—it looks messy, but I know where everything is.", scores: { CS: -1, RO: 1 } },
      { label: "Filled with sentimental items, photos, and memories.", scores: { ED: 2, LS: 1 } },
      { label: "A disaster zone.", scores: { CS: -3 } },
      { label: "Designed for hosting—lots of seating and cool lighting.", scores: { SE: 2 } },
    ],
  },
  {
    id: 12,
    phase: "The Hard Choices",
    text: "You see a \"Do Not Enter\" sign on an unlocked door in an interesting building. You:",
    options: [
      { label: "Walk right in. I want to see what's there.", scores: { RO: 3, CS: -2 } },
      { label: "Peek through the window but don't go in.", scores: { RO: 1 } },
      { label: "Would never go in; rules exist for a reason.", scores: { CS: 3, RO: -2 } },
      { label: "Only go in if my friends pressure me to.", scores: { SE: 2, LS: 1 } },
      { label: "Imagine a horror scenario of what's inside and walk away fast.", scores: { ED: 2, RO: -1 } },
    ],
  },
  {
    id: 13,
    phase: "The Hard Choices",
    text: "A friend asks to borrow your car. You know they are a bad driver. You:",
    options: [
      { label: "Say yes because I can't say no to people I love.", scores: { LS: 3, CS: -1 } },
      { label: "Say no directly. My property is my responsibility.", scores: { CS: 2, LS: -1 } },
      { label: "Lie and say the car is in the shop.", scores: { LS: 1, RO: -1 } },
      { label: "Say yes, but give them a 10-minute lecture on how to drive it.", scores: { CS: 2 } },
      { label: "Say yes, but I'm coming with you!", scores: { SE: 1, RO: 1 } },
    ],
  },
  {
    id: 14,
    phase: "The Hard Choices",
    text: "When arguing, your style is:",
    options: [
      { label: "I cry or get very emotional quickly.", scores: { ED: 3 } },
      { label: "I am cold, logical, and focus on the facts.", scores: { CS: 2, ED: -2 } },
      { label: "I yell and let it all out, then forgive 10 minutes later.", scores: { SE: 2, RO: 1 } },
      { label: "I shut down and give the silent treatment.", scores: { SE: -2, ED: 1 } },
      { label: "I apologize immediately just to stop the fighting.", scores: { LS: 3 } },
    ],
  },
  {
    id: 15,
    phase: "The Hard Choices",
    text: "You are at a restaurant and the waiter brings the wrong order. You:",
    options: [
      { label: "Eat it anyway. I don't want to be a burden.", scores: { LS: 2, SE: -1 } },
      { label: "Politely but firmly send it back. I want what I paid for.", scores: { CS: 2 } },
      { label: "Make a scene or demand to see the manager.", scores: { SE: 1, CS: 1 } },
      { label: "Joke about it with the waiter and eat it if it looks good.", scores: { SE: 2, RO: 1 } },
      { label: "Feel personally slighted and ruin my own mood.", scores: { ED: 2 } },
    ],
  },
  // Phase 4: Abstract & Synthesis
  {
    id: 16,
    phase: "Abstract & Synthesis",
    text: "Choose a metaphor for your life:",
    options: [
      { label: "A roller coaster (high highs, low lows).", scores: { RO: 2, ED: 2 } },
      { label: "A well-built fortress (safe, strong, enduring).", scores: { CS: 3, RO: -2 } },
      { label: "A garden (nurturing, growing, requires patience).", scores: { LS: 2, ED: 1 } },
      { label: "A grand stage (performance, audience, applause).", scores: { SE: 3 } },
      { label: "A library (quiet, deep, full of knowledge).", scores: { SE: -2, CS: 1 } },
    ],
  },
  {
    id: 17,
    phase: "Abstract & Synthesis",
    text: "If you could have one superpower, it would be:",
    options: [
      { label: "Mind Control (to make people do what they should).", scores: { CS: 3 } },
      { label: "Flight (freedom and adrenaline).", scores: { RO: 2 } },
      { label: "Healing (to take away others' pain).", scores: { LS: 3 } },
      { label: "Invisibility (to observe without engaging).", scores: { SE: -2 } },
      { label: "Telepathy (to truly understand deep emotions).", scores: { ED: 3 } },
    ],
  },
  {
    id: 18,
    phase: "Abstract & Synthesis",
    text: "Your schedule for tomorrow is completely empty. How does that feel?",
    options: [
      { label: "Terrifying. I need to fill it immediately.", scores: { CS: 2, SE: 1 } },
      { label: "Relief. Finally, some peace.", scores: { SE: -2 } },
      { label: "An opportunity for adventure.", scores: { RO: 2 } },
      { label: "Lonely. Who can I hang out with?", scores: { SE: 3, LS: 1 } },
      { label: "A chance to reorganize my life.", scores: { CS: 2 } },
    ],
  },
  {
    id: 19,
    phase: "Abstract & Synthesis",
    text: "You are working on a team project. You prefer to be:",
    options: [
      { label: "The Leader (calling the shots).", scores: { CS: 2, SE: 1 } },
      { label: "The Ideator (coming up with crazy concepts).", scores: { RO: 2, CS: -1 } },
      { label: "The Peacemaker (resolving conflicts between members).", scores: { LS: 2, ED: 1 } },
      { label: "The Worker Bee (tell me what to do and I'll do it).", scores: { CS: 1, RO: -1 } },
      { label: "The Presenter (doing the talking at the end).", scores: { SE: 3 } },
    ],
  },
  {
    id: 20,
    phase: "Abstract & Synthesis",
    text: "The \"Burning Building\" Question: You can only save one thing from a fire (assuming people/pets are safe).",
    options: [
      { label: "My laptop/hard drive (all my work and plans).", scores: { CS: 3 } },
      { label: "A box of old love letters and journals.", scores: { ED: 3, LS: 1 } },
      { label: "My passport (freedom to leave).", scores: { RO: 2 } },
      { label: "My phone (connection to the world).", scores: { SE: 3 } },
      { label: "An expensive heirloom I plan to pass down.", scores: { LS: 2, CS: 1 } },
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
    CS: {
      name: "The Architect",
      emoji: "🏗️",
      description: "You build worlds with precision. Order is your art, and mastery is your mission.",
      rarity: "Top 8%",
    },
    ED: {
      name: "The Mirror",
      emoji: "🪞",
      description: "You feel what others can't name. Your depth is your superpower — and your weight.",
      rarity: "Top 5%",
    },
    SE: {
      name: "The Spark",
      emoji: "⚡",
      description: "You light up rooms and connect souls. People orbit around your warmth.",
      rarity: "Top 12%",
    },
    RO: {
      name: "The Wildcard",
      emoji: "🃏",
      description: "You chase the unknown with open arms. Comfort zones bore you — chaos is your canvas.",
      rarity: "Top 3%",
    },
    LS: {
      name: "The Guardian",
      emoji: "🛡️",
      description: "You carry others before yourself. Loyalty isn't a choice — it's your identity.",
      rarity: "Top 6%",
    },
  };

  const base = archetypes[top];

  const blends: Record<string, string> = {
    "CS+ED": "The Calculated Heart",
    "CS+SE": "The Social Strategist",
    "CS+RO": "The Mastermind",
    "CS+LS": "The Silent Pillar",
    "ED+CS": "The Poetic Analyst",
    "ED+SE": "The Empath",
    "ED+RO": "The Romantic Rebel",
    "ED+LS": "The Healer",
    "SE+CS": "The Charming Commander",
    "SE+ED": "The Soul Connector",
    "SE+RO": "The Life of the Party",
    "SE+LS": "The Selfless Host",
    "RO+CS": "The Calculated Daredevil",
    "RO+ED": "The Passionate Nomad",
    "RO+SE": "The Thrill Seeker",
    "RO+LS": "The Noble Rebel",
    "LS+CS": "The Quiet Hero",
    "LS+ED": "The Eternal Giver",
    "LS+SE": "The People's Champion",
    "LS+RO": "The Brave Protector",
  };

  const blendKey = `${top}+${second}`;
  const blendName = blends[blendKey] || base.name;

  return {
    ...base,
    name: blendName,
    rarity: base.rarity,
  };
}
