// Principle Centered Planner - Wiki Content
// Content for in-app wiki pages explaining Covey methodology concepts

export interface WikiConcept {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  content: string;
  relatedConcepts?: string[];
}

export const WIKI_CONCEPTS: WikiConcept[] = [
  {
    id: 'mission',
    title: 'Personal Mission',
    subtitle: 'Your internal compass',
    emoji: '🧭',
    content: `A Personal Mission Statement is your personal constitution — a living document that describes who you want to be (character) and what you want to accomplish (contributions and achievements).

**Why It Matters**
Your mission serves as an unchanging inner compass that guides all your decisions. When you have a clear mission, you can evaluate every opportunity, challenge, and choice against it.

**How to Create Yours**
Ask yourself:
• What do I want to be remembered for?
• What principles do I want to live by?
• What legacy do I want to leave?

Your mission should be:
• **Timeless** — not tied to specific goals
• **Authentic** — reflecting your true values
• **Actionable** — guiding daily decisions

Review and refine your mission regularly. It's a living document that grows with you.`,
    relatedConcepts: ['values', 'roles'],
  },
  {
    id: 'values',
    title: 'Core Values',
    subtitle: 'Principles that guide your behavior',
    emoji: '💎',
    content: `Values are the fundamental beliefs and principles that guide your behavior. They're the non-negotiable standards you live by.

**Why Values Matter**
When you're clear about your values, decision-making becomes easier. Values act as filters — helping you say yes to what aligns and no to what doesn't.

**Defining Your Values**
For each value you identify:
1. Name it clearly (e.g., "Integrity")
2. Write what it means to YOU
3. Describe how you'll live it daily

**Examples**
• **Integrity** — "I do what I say I'll do, even when no one is watching"
• **Family** — "I create time for meaningful connection with loved ones"
• **Growth** — "I embrace challenges as opportunities to learn"

Choose 5-7 core values. Too many dilutes their power.`,
    relatedConcepts: ['mission', 'goals'],
  },
  {
    id: 'roles',
    title: 'Life Roles',
    subtitle: 'The different hats you wear',
    emoji: '🎭',
    content: `Roles represent the different areas of responsibility in your life. They help you maintain balance and ensure no important area is neglected.

**Why Roles Matter**
Without conscious attention, some roles dominate (often work) while others suffer (often family, health). Naming your roles helps you plan for balance.

**Common Role Examples**
• Personal: Self, Learner, Individual
• Family: Parent, Spouse, Sibling
• Work: Manager, Team Member, Colleague
• Community: Friend, Neighbor, Volunteer

**How to Use Roles**
1. Identify 5-7 key roles
2. For each role, define who you want to BE in that role
3. Each week, plan at least one "Big Rock" for your most important roles

This ensures you make progress across all areas of life, not just the loudest ones.`,
    relatedConcepts: ['mission', 'big-rocks'],
  },
  {
    id: 'goals',
    title: 'Long-term Goals',
    subtitle: 'Dreams with deadlines',
    emoji: '🎯',
    content: `Goals are dreams with deadlines. They connect your vision to concrete actions.

**Effective Goals Are:**
• **Specific** — Clear and unambiguous
• **Linked** — Connected to your values and roles
• **Time-bound** — Have a deadline
• **Broken down** — Divided into actionable steps

**Goal Structure**
For each goal, define:
1. **What** — The specific outcome you want
2. **Why** — Which value or role it serves
3. **When** — Target completion date
4. **How** — Steps to get there

**Example**
Goal: "Launch my online course by March 1st"
• Why: Supports my role as "Expert" and value of "Impact"
• Steps: Outline content, record lessons, set up platform, test, launch

Link each goal to your values and roles to ensure you're pursuing what truly matters.`,
    relatedConcepts: ['values', 'roles', 'big-rocks'],
  },
  {
    id: 'big-rocks',
    title: 'Big Rocks',
    subtitle: 'Your weekly priorities',
    emoji: '🪨',
    content: `"Big Rocks" is a powerful metaphor: if you don't put the big rocks in the jar first, you'll never fit them in after filling it with sand and gravel.

**What Are Big Rocks?**
They are the 3-5 most important things you need to accomplish THIS WEEK. They're always Quadrant II activities — important but not urgent.

**Big Rocks Are Always:**
• Aligned with your goals and roles
• Important for long-term success
• NOT urgent (preventive, not reactive)
• Scheduled with specific time blocks

**Weekly Planning Process**
1. Review your mission, values, and roles
2. Identify 1-2 Big Rocks per key role
3. Schedule them FIRST in your calendar
4. Fill remaining time with other tasks

**Example Big Rocks**
• "Have date night with spouse" (Spouse role)
• "Complete project proposal" (Professional role)
• "Exercise 3 times" (Self role)

The key insight: schedule your priorities, or your calendar fills with other people's priorities.`,
    relatedConcepts: ['roles', 'quadrants', 'weekly-planning'],
  },
  {
    id: 'quadrants',
    title: 'Time Matrix',
    subtitle: 'The four quadrants of urgency and importance',
    emoji: '📊',
    content: `The Time Management Matrix (also called the Eisenhower Matrix) categorizes all activities by two criteria: Urgency and Importance.

**The Four Quadrants**

**Quadrant I — Urgent & Important** 🔴
Crises, pressing problems, deadline-driven projects
• Should be minimized through better Q2 planning
• Can't be eliminated entirely

**Quadrant II — Not Urgent & Important** 🟢
Prevention, planning, relationship building, personal development
• The FOCUS area for effectiveness
• Reduces time spent in Q1

**Quadrant III — Urgent & Not Important** 🟡
Interruptions, some calls/emails, others' priorities
• Often mistaken for Q1
• Learn to say no or delegate

**Quadrant IV — Not Urgent & Not Important** ⚪
Time wasters, busy work, escape activities
• Minimize or eliminate
• Often disguised as "breaks"

**The Goal**
Spend MORE time in Quadrant II to REDUCE time in Quadrant I. When you invest in prevention, planning, and preparation, crises become rare.

Most people live in Q1 and Q3, constantly reacting. Effective people prioritize Q2.`,
    relatedConcepts: ['big-rocks', 'priorities'],
  },
  {
    id: 'priorities',
    title: 'A-B-C Priorities',
    subtitle: 'Daily task prioritization system',
    emoji: '🔢',
    content: `The A-B-C priority system helps you focus on what matters most each day.

**Priority Levels**

**A — Must Do** ❗
• Critical tasks with real consequences if not done
• Top priority for today
• Complete these first

**B — Should Do** 📌
• Important but less critical
• Do after completing A tasks
• Can wait a day if needed

**C — Could Do** ⚡
• Nice to do, but low impact
• Complete if time allows
• First candidates to defer or delete

**Daily Planning**
1. List all tasks for the day
2. Assign A, B, or C to each
3. Work on A tasks first, no matter what
4. Move to B when A's are done
5. C's only if time permits

**Key Principle**
Never do a B before all A's are done. Never do a C before all B's.

This discipline ensures you complete what truly matters, not just what's easy or visible.`,
    relatedConcepts: ['quadrants', 'daily-planning'],
  },
  {
    id: '30-10-promise',
    title: 'The 30/10 Promise',
    subtitle: 'The commitment to consistent planning',
    emoji: '⏰',
    content: `The 30/10 Promise is a commitment to invest in planning:
• **30 minutes** for weekly planning
• **10 minutes** for daily planning

**Why It Works**
Planning is a Quadrant II activity. It's important but never urgent — so it's easy to skip. Making it a "promise" creates accountability.

**The Weekly 30**
Each week (ideally Sunday):
1. Review your mission, values, roles (5 min)
2. Identify Big Rocks for key roles (10 min)
3. Schedule Big Rocks in calendar (10 min)
4. Review calendar and adjust (5 min)

**The Daily 10**
Each day (morning or evening before):
1. Review today's appointments (2 min)
2. List tasks and assign A-B-C (5 min)
3. Estimate time for each (3 min)

**Building the Habit**
• Same time, same place
• Track your streak
• Celebrate consistency

A small daily investment yields massive returns in focus and effectiveness.`,
    relatedConcepts: ['big-rocks', 'priorities', 'weekly-planning'],
  },
  {
    id: 'weekly-planning',
    title: 'Weekly Planning',
    subtitle: 'The 30-minute ritual',
    emoji: '📅',
    content: `Weekly planning is the cornerstone habit of principle-centered planning. It bridges your long-term vision with daily actions.

**The Three Steps**

**Step 1: Review Your Foundation** (5 min)
• Read your mission statement
• Scan your values and roles
• Connect with what matters most

**Step 2: Identify Big Rocks** (10 min)
• For each key role, ask: "What's the ONE thing I could do this week that would make the biggest difference?"
• Select 3-5 Big Rocks total
• Ensure they're Quadrant II

**Step 3: Schedule Big Rocks** (10 min)
• Put Big Rocks in your calendar FIRST
• Choose specific time blocks
• Treat them like unmovable appointments
• Add other commitments around them

**When to Plan**
• Ideal: Sunday evening or Monday morning
• Before the week's chaos begins
• Same time each week for consistency

Weekly planning transforms you from reactive to proactive. You stop living by inbox and start living by intention.`,
    relatedConcepts: ['big-rocks', 'roles', '30-10-promise'],
  },
  {
    id: 'daily-planning',
    title: 'Daily Planning',
    subtitle: 'The 10-minute focus ritual',
    emoji: '📋',
    content: `Daily planning ensures each day moves you toward your weekly and long-term goals.

**The Process** (10 minutes)

1. **Review Your Day** (2 min)
   • Check calendar for fixed commitments
   • Note your Big Rocks for this week

2. **List Tasks** (3 min)
   • Brain dump everything you need to do
   • Include both scheduled and unscheduled items

3. **Prioritize** (3 min)
   • Assign A, B, or C to each task
   • Be honest — not everything is an "A"

4. **Estimate Time** (2 min)
   • How long will each A task take?
   • Do you have enough time for all A's?

**When to Plan**
• Morning: Start fresh with clarity
• Evening before: Wake up ready to act
• Choose one and stick with it

**Tips**
• Don't overload — be realistic
• Leave buffer time for surprises
• Review and adjust at day's end

Daily planning turns intention into action.`,
    relatedConcepts: ['priorities', '30-10-promise'],
  },
];

export function getWikiConcept(id: string): WikiConcept | undefined {
  return WIKI_CONCEPTS.find(concept => concept.id === id);
}

export function getRelatedConcepts(id: string): WikiConcept[] {
  const concept = getWikiConcept(id);
  if (!concept?.relatedConcepts) return [];
  return concept.relatedConcepts
    .map(relatedId => getWikiConcept(relatedId))
    .filter((c): c is WikiConcept => c !== undefined);
}
