# Design Document
## MindTrack AI — Mental Health Journal & Emotion Tracker

**Author:** Mohammed Farhan K
**Version:** 1.0
**Status:** Active
**Last Updated:** June 2026

---

## 1. Design Philosophy

MindTrack AI is a wellness product. The design must feel **calm, trustworthy, and personal** — never clinical or cold. Every screen should make the user feel safe writing something private.

The visual identity is built on:
- **Purple** as the primary brand color — associated with mindfulness, creativity, and introspection.
- **Soft backgrounds** — light grey/white, never stark white, to reduce visual fatigue.
- **Rounded corners everywhere** — pill buttons, card corners — signals softness and approachability.
- **Gradient accents** — purple-to-teal gradient used sparingly on hero text and CTAs.

The design you see in the screenshot (purple nav, warm hero image, pill buttons, dual-color headline) is the source of truth for all UI decisions in this document.

---

## 2. Color System

### 2.1 Primary Palette

| Name | Hex | Usage |
|---|---|---|
| **Brand Purple** | `#7C3AED` | Primary buttons, active nav, logo, icons |
| **Brand Purple Light** | `#8B5CF6` | Hover states, secondary accents |
| **Brand Purple Pale** | `#EDE9FE` | Button backgrounds (ghost), active nav bg, tag backgrounds |
| **Brand Green** | `#10B981` | Gradient accent on hero text ("your"), positive emotion badge, streak indicators |
| **Brand Teal** | `#06B6D4` | Chart lines, sparkline, mood history accents |

### 2.2 Neutral Palette

| Name | Hex | Usage |
|---|---|---|
| **Background** | `#F5F5FA` | Page background — light lavender-grey, not pure white |
| **Surface** | `#FFFFFF` | Cards, modals, nav bar |
| **Border** | `#E5E7EB` | Card borders, dividers, input outlines |
| **Text Primary** | `#111827` | Headlines, body text |
| **Text Secondary** | `#6B7280` | Subtitles, labels, metadata |
| **Text Placeholder** | `#9CA3AF` | Input placeholders |

### 2.3 Semantic / Emotion Colors

These are used on emotion badges, mood indicators, and analysis result chips.

| Emotion | Color | Hex |
|---|---|---|
| Happy | Amber | `#F59E0B` |
| Excited | Orange | `#F97316` |
| Hopeful | Green | `#10B981` |
| Grateful | Teal | `#14B8A6` |
| Neutral | Grey | `#6B7280` |
| Anxious | Yellow | `#EAB308` |
| Frustrated | Red-Orange | `#EF4444` |
| Sad | Blue | `#3B82F6` |
| Angry | Red | `#DC2626` |
| Exhausted | Purple-Grey | `#7C3AED` opacity 60% |

### 2.4 Sentiment Colors

| Sentiment | Color | Hex |
|---|---|---|
| Positive | Green | `#10B981` |
| Neutral | Grey | `#6B7280` |
| Negative | Red | `#EF4444` |

### 2.5 Gradients

```css
/* Hero text gradient — "Nourish" word */
background: linear-gradient(90deg, #7C3AED 0%, #10B981 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

/* CTA button gradient */
background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);

/* Card hover shimmer */
background: linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%);
```

### 2.6 Shadows

```css
/* Card default */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);

/* Card hover */
box-shadow: 0 4px 12px rgba(124, 58, 237, 0.12);

/* Modal */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);

/* Navbar */
box-shadow: 0 1px 0 #E5E7EB;
```

---

## 3. Typography

### 3.1 Font Stack

```css
/* Display / Headlines */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Body / UI */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace (code, mood scores) */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

> Use Inter from Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap`

### 3.2 Type Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display-xl` | 48px / 3rem | 800 | 1.1 | Hero headline ("Understand your mind.") |
| `display-lg` | 36px / 2.25rem | 700 | 1.2 | Page titles |
| `heading-xl` | 28px / 1.75rem | 700 | 1.3 | Section headings |
| `heading-lg` | 22px / 1.375rem | 600 | 1.4 | Card headings |
| `heading-md` | 18px / 1.125rem | 600 | 1.4 | Sub-section headings |
| `body-lg` | 16px / 1rem | 400 | 1.6 | Primary body text, journal content |
| `body-md` | 14px / 0.875rem | 400 | 1.5 | Secondary text, descriptions |
| `body-sm` | 13px / 0.8125rem | 400 | 1.5 | Metadata, timestamps |
| `label` | 12px / 0.75rem | 500 | 1.4 | Tags, badges, nav labels |
| `mono` | 14px / 0.875rem | 500 | 1.4 | Mood scores, data numbers |

### 3.3 Special Treatments

```css
/* Hero headline — split color like screenshot */
.hero-headline span.accent-purple { color: #7C3AED; }
.hero-headline span.accent-green  { color: #10B981; }

/* Mood score — big number display */
.mood-score-display {
  font-size: 48px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: #7C3AED;
}

/* Nav brand name */
.brand-name {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}
```

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

### 4.2 Border Radius

```css
--radius-sm:   6px;   /* Inputs, small chips */
--radius-md:   10px;  /* Cards */
--radius-lg:   16px;  /* Modals, large cards */
--radius-xl:   24px;  /* Hero image frame */
--radius-full: 9999px; /* Pill buttons, badges, avatar */
```

### 4.3 Page Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│                        NAVBAR (64px)                      │
│  [Logo] [Home][Dashboard][Mood][Journal][AI][Insights]    │
│                              [New Entry btn] [Bell][User] │
├──────────────────────────────────────────────────────────┤
│                                                           │
│   MAIN CONTENT AREA                                       │
│   max-width: 1280px, padding: 0 24px, margin: auto        │
│                                                           │
│   Each page renders inside here                           │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### 4.4 Grid System

```css
/* Page wrapper */
.page-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Dashboard 3-column grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Home hero — 2 column split */
.hero-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  min-height: calc(100vh - 64px);
  padding: 60px 0;
}

/* Journal list — 1 column, centered */
.journal-list {
  max-width: 720px;
  margin: 0 auto;
}

/* Responsive breakpoints */
@media (max-width: 1024px) { .dashboard-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px)  { .dashboard-grid { grid-template-columns: 1fr; } }
@media (max-width: 768px)  { .hero-layout { grid-template-columns: 1fr; } }
```

---

## 5. Component Library

### 5.1 Navbar

**Structure:** Fixed top, full-width, white background, bottom border.

```
[BrainIcon] MindTrack AI          [Home] [Dashboard] [Mood Tracker]
Your Mental Wellness Companion    [Journal] [AI Assistant] [Insights]
                                  [Profile] [+New Entry] [Bell] [Avatar] [Logout]
```

**Specs:**
- Height: 64px
- Background: `#FFFFFF`
- Border-bottom: `1px solid #E5E7EB`
- Active nav item: background `#EDE9FE`, color `#7C3AED`, border-radius `--radius-full`
- Logo icon: purple brain icon in a `#F3F0FF` circle, 36px
- "New Entry" button: pill shape, `background: linear-gradient(135deg, #7C3AED, #6D28D9)`, white text, `+` icon

```css
.nav-item {
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  transition: all 0.15s ease;
}
.nav-item:hover { background: #F5F5FA; color: #111827; }
.nav-item.active { background: #EDE9FE; color: #7C3AED; }

.btn-new-entry {
  background: linear-gradient(135deg, #7C3AED, #6D28D9);
  color: white;
  padding: 8px 18px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}
```

### 5.2 Buttons

**Primary (Purple Pill)**
```css
.btn-primary {
  background: linear-gradient(135deg, #7C3AED, #6D28D9);
  color: white;
  padding: 12px 24px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}
.btn-primary:hover  { opacity: 0.92; transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }
```

**Secondary (Ghost Pill)**
```css
.btn-secondary {
  background: white;
  color: #374151;
  padding: 12px 24px;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 15px;
  border: 1.5px solid #E5E7EB;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.btn-secondary:hover { border-color: #7C3AED; background: #F5F3FF; color: #7C3AED; }
```

**Destructive**
```css
.btn-danger {
  background: #FEF2F2;
  color: #DC2626;
  border: 1.5px solid #FECACA;
  /* same shape as secondary */
}
```

### 5.3 Cards

**Standard Card**
```css
.card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  padding: 24px;
  transition: box-shadow 0.2s, transform 0.15s;
}
.card:hover {
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.10);
  transform: translateY(-2px);
}
```

**Stat Card** (like "3 Entries" and "5/10 Avg Mood Score" from screenshot)
```css
.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 12px 18px;
}
.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FEF3C7; /* amber for mood, rose for entries */
}
.stat-value { font-size: 20px; font-weight: 700; color: #111827; }
.stat-label { font-size: 12px; color: #6B7280; }
```

**Journal Entry Card**
```css
.journal-card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  padding: 20px 24px;
  cursor: pointer;
}
/* Header: date + emotion badge */
/* Body: content preview (2 lines, truncated) */
/* Footer: mood score bar + sentiment chip */
```

### 5.4 Emotion Badge

```css
.emotion-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}
/* Colors set dynamically based on emotion — see Section 2.3 */
/* e.g. happy → background: #FEF3C7, color: #92400E */
```

**Emotion → Background + Text color map:**
```javascript
const EMOTION_COLORS = {
  happy:      { bg: '#FEF3C7', text: '#92400E' },
  excited:    { bg: '#FED7AA', text: '#9A3412' },
  hopeful:    { bg: '#D1FAE5', text: '#065F46' },
  grateful:   { bg: '#CCFBF1', text: '#0F766E' },
  neutral:    { bg: '#F3F4F6', text: '#374151' },
  anxious:    { bg: '#FEF9C3', text: '#713F12' },
  frustrated: { bg: '#FEE2E2', text: '#991B1B' },
  sad:        { bg: '#DBEAFE', text: '#1E40AF' },
  angry:      { bg: '#FEE2E2', text: '#DC2626' },
  exhausted:  { bg: '#EDE9FE', text: '#5B21B6' },
};
```

### 5.5 Mood Score Bar

```css
.mood-bar-track {
  height: 8px;
  background: #E5E7EB;
  border-radius: 9999px;
  overflow: hidden;
}
.mood-bar-fill {
  height: 100%;
  border-radius: 9999px;
  /* Color: green for 7-10, amber for 4-6, red for 0-3 */
  transition: width 0.4s ease;
}
```

```javascript
const getMoodColor = (score) => {
  if (score >= 7) return '#10B981';
  if (score >= 4) return '#F59E0B';
  return '#EF4444';
};
```

### 5.6 Form Inputs

```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #E5E7EB;
  border-radius: 10px;
  font-size: 15px;
  color: #111827;
  background: white;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}
.input:focus {
  border-color: #7C3AED;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}
.input::placeholder { color: #9CA3AF; }

/* Journal textarea */
.journal-textarea {
  min-height: 200px;
  resize: vertical;
  font-family: 'Inter', sans-serif;
  line-height: 1.7;
}
```

### 5.7 Toast / Notification

```css
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 14px 18px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.10);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 9999;
  animation: slideUp 0.25s ease;
}
.toast.success { border-left: 3px solid #10B981; }
.toast.error   { border-left: 3px solid #EF4444; }
```

### 5.8 Loading States

```css
/* Skeleton shimmer for cards while AI is processing */
.skeleton {
  background: linear-gradient(90deg, #F3F4F6 25%, #E9EAEC 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 8px;
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

**AI analysis loading state:** After submitting a journal entry, show a skeleton card with the text "Analyzing your entry..." and the purple brain icon pulsing.

### 5.9 Crisis Banner

Shown when `crisis_detected: true` is returned by the API. Always rendered above the analysis result, never hidden.

```css
.crisis-banner {
  background: #FEF2F2;
  border: 1.5px solid #FECACA;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}
.crisis-banner-icon { color: #DC2626; flex-shrink: 0; }
.crisis-banner-title { font-weight: 600; color: #991B1B; font-size: 14px; }
.crisis-banner-body  { font-size: 13px; color: #7F1D1D; line-height: 1.5; }
.crisis-banner-link  { color: #DC2626; font-weight: 600; text-decoration: underline; }
```

---

## 6. Page-by-Page Layout

### 6.1 Home Page (`/`)

```
┌─────────────────────────────────────────────────────────┐
│ NAVBAR                                                   │
├──────────────────────────┬──────────────────────────────┤
│ LEFT COLUMN              │ RIGHT COLUMN                  │
│                          │                               │
│ [eyebrow: Your wellness  │  ┌─────────────────────────┐ │
│  companion]              │  │                         │ │
│                          │  │   Hero Illustration     │ │
│ Understand your mind.    │  │   (brain/silhouette     │ │
│ Nourish [purple] your    │  │    image, rounded       │ │
│ [green] well-being.      │  │    corners, 500px h)    │ │
│                          │  │                         │ │
│ [subtitle text]          │  └─────────────────────────┘ │
│                          │                               │
│ [Track My Mood] [Write]  │                               │
│                          │                               │
│ [Stat: 3 entries][Stat:  │                               │
│  5/10 avg mood]          │                               │
├──────────────────────────┴──────────────────────────────┤
│ FEATURES STRIP (3 cards: Journal / AI Analysis / Trends) │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Dashboard (`/dashboard`)

```
┌──────────────────────────────────────────────────────────┐
│ NAVBAR                                                    │
├──────────────────────────────────────────────────────────┤
│ Page Title: "Your Dashboard"    [Date range filter]       │
│                                                           │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ Entries │ │Avg Mood │ │ Streak  │ │ Top     │        │
│ │   21    │ │  7.2    │ │  5 days │ │ Emotion │        │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
│                                                           │
│ ┌──────────────────────────┐ ┌───────────────────────┐  │
│ │  Mood Score Chart        │ │  Emotion Distribution │  │
│ │  (line chart, 7/30 days) │ │  (donut / bar chart)  │  │
│ └──────────────────────────┘ └───────────────────────┘  │
│                                                           │
│ ┌──────────────────────────────────────────────────────┐ │
│ │  Recent Journal Entries (last 5, card list)          │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 6.3 Journal Page (`/journal`)

```
┌──────────────────────────────────────────────────────────┐
│ NAVBAR                                                    │
├──────────────────────────────────────────────────────────┤
│ "My Journal"                        [+ New Entry btn]     │
│                                     [Search input]        │
├─────────────────────────────────────────────────────────-┤
│                                                           │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ Jun 25, 2026 · 2:30 PM            [happy] [positive]│  │
│ │ Title: "Productive morning..."                       │  │
│ │ "Today I finally finished the Django setup and..."  │  │
│ │ ████████░░ 8/10                      [Edit][Delete] │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ Jun 24, 2026 · 9:00 PM            [anxious][neutral]│  │
│ │ "Feeling a bit overwhelmed with the deadline..."    │  │
│ │ ████░░░░░░ 4/10                      [Edit][Delete] │  │
│ └─────────────────────────────────────────────────────┘  │
│                              [Load more / pagination]     │
└──────────────────────────────────────────────────────────┘
```

### 6.4 New Entry Modal / Page (`/journal/new`)

```
┌──────────────────────────────────────────┐
│  Write in your journal          [✕ close]│
├──────────────────────────────────────────┤
│  Title (optional)                         │
│  ┌──────────────────────────────────┐    │
│  │ Give your entry a title...       │    │
│  └──────────────────────────────────┘    │
│                                           │
│  What's on your mind?                     │
│  ┌──────────────────────────────────┐    │
│  │                                  │    │
│  │  (textarea, min 200px)           │    │
│  │                                  │    │
│  └──────────────────────────────────┘    │
│  Word count: 0 words                      │
│                                           │
│           [Save & Analyze →]              │
└──────────────────────────────────────────┘

After submission → show AI loading state:

┌──────────────────────────────────────────┐
│  🧠  Analyzing your entry...              │
│  [skeleton shimmer card]                  │
│  This usually takes 2-3 seconds           │
└──────────────────────────────────────────┘

After analysis → show result:

┌──────────────────────────────────────────┐
│  ✅ Entry saved                            │
├──────────────────────────────────────────┤
│  [crisis banner — ONLY if detected]       │
│                                           │
│  Emotion: [happy badge]                   │
│  Mood Score: 8/10  ████████░░             │
│  Sentiment: Positive                      │
│                                           │
│  💡 Wellness Suggestion                   │
│  "Great day! Try to document what made    │
│   it good so you can replicate it."       │
│                                           │
│  [View All Entries]  [Write Another]      │
└──────────────────────────────────────────┘
```

### 6.5 Mood Tracker Page (`/mood`)

```
┌──────────────────────────────────────────────────────────┐
│ NAVBAR                                                    │
├──────────────────────────────────────────────────────────┤
│ "Mood Tracker"          [7 days] [30 days] [All time]    │
│                                                           │
│ ┌──────────────────────────────────────────────────────┐ │
│ │  Mood Over Time (Recharts LineChart)                 │ │
│ │  X: dates, Y: 0-10, purple line, dots on each point │ │
│ │  Height: 280px                                       │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌────────────┐ ┌────────────┐ ┌────────────────────────┐ │
│ │ Avg Score  │ │ Best Day   │ │ Trend                  │ │
│ │    7.2     │ │ Jun 22 / 9 │ │ ↑ Improving            │ │
│ └────────────┘ └────────────┘ └────────────────────────┘ │
│                                                           │
│ ┌──────────────────────────────────────────────────────┐ │
│ │  Weekly Report                                       │ │
│ │  "This week you felt mostly hopeful with moments..." │ │
│ │  [Generate This Week's Report]                       │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 6.6 AI Assistant Page (`/ai-assistant`)

```
┌──────────────────────────────────────────────────────────┐
│ NAVBAR                                                    │
├──────────────────────────────────────────────────────────┤
│ "AI Wellness Assistant"                                   │
│                                                           │
│ ┌──────────────────────────────────────────────────────┐ │
│ │  🧠  Based on your last 7 entries, you've been       │ │
│ │  feeling mostly anxious (42%) with a mood trend      │ │
│ │  that is slowly improving. Here's what I suggest:    │ │
│ │                                                       │ │
│ │  1. Morning journaling before checking your phone    │ │
│ │  2. 5-minute breathing exercise on low-score days    │ │
│ │  3. [Read your Week 2 Summary Report →]              │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                           │
│  [Re-generate Insights]    [Download as PDF]              │
└──────────────────────────────────────────────────────────┘
```

### 6.7 Auth Pages (`/login`, `/register`)

```
┌──────────────────────────────────────┐
│  [Brain icon]  MindTrack AI          │
│                                      │
│  Welcome back                        │
│  Sign in to your wellness journal    │
│                                      │
│  Email                               │
│  ┌──────────────────────────────┐   │
│  │ you@example.com              │   │
│  └──────────────────────────────┘   │
│                                      │
│  Password                            │
│  ┌──────────────────────────────┐   │
│  │ ••••••••                     │   │
│  └──────────────────────────────┘   │
│                                      │
│  [Sign In →]   (full width, purple)  │
│                                      │
│  Don't have an account? [Register]   │
└──────────────────────────────────────┘
```

Register page adds: Name field + consent checkbox:
```
☐ I understand my journal entries are processed by
  Google Gemini AI for emotion analysis. [Privacy Policy]
```

---

## 7. User Flows

### 7.1 New User Registration Flow

```
Landing (/) 
  → [Get Started] or [Register] 
    → /register 
      → Fill: name, email, password 
      → Check: AI consent checkbox (required)
      → [Create Account]
        → POST /api/auth/register/
          → Success → redirect to /journal (empty state)
          → Error   → show inline field errors
```

### 7.2 Write & Analyze Entry Flow

```
Any page → [New Entry] button (navbar)
  → New Entry modal/page opens
    → User types title (optional) + content (required, min 10 chars)
    → [Save & Analyze →]
      → POST /api/entries/
        → Entry saved → 201 returned
        → AI loading state shown (skeleton + "Analyzing...")
        → POST /api/analyze/{id}/ fires
          → Success:
            → [crisis banner if crisis_detected]
            → Show: emotion badge, mood score bar, sentiment, suggestion
            → Streak updated if first entry today
          → Gemini error:
            → Show fallback: "We saved your entry but couldn't analyze it right now."
            → [Retry Analysis] button
```

### 7.3 View Mood History Flow

```
Navbar → [Mood Tracker]
  → /mood loads
    → GET /api/mood/history/?days=7 fires
      → Chart renders with mood scores
      → Stat cards show: avg, best day, trend
    → [30 days] tab click
      → GET /api/mood/history/?days=30 fires
      → Chart re-renders with animation
    → [Generate This Week's Report]
      → POST /api/mood/summary/generate/
        → Loading spinner on button
        → Report card renders below
```

### 7.4 Return User Daily Flow

```
User opens app → already logged in (JWT in localStorage)
  → / (Home) loads
    → Shows: entries last 7 days count, avg mood score
    → [Write in Journal] 
      → jump to Flow 7.2
```

### 7.5 Delete Account Flow

```
Profile → [Delete My Account]
  → Confirmation modal:
    "This will permanently delete all your journal entries,
     emotion analysis, and account data. This cannot be undone."
  → Type "DELETE" to confirm
  → [Confirm Delete]
    → DELETE /api/users/me/
      → All data wiped in Supabase (cascade)
      → Redirect to /register with success banner
```

---

## 8. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `≥ 1280px` | Full desktop layout. 3-col dashboard grid, 2-col hero. |
| `1024px – 1279px` | 2-col dashboard grid. Hero still 2-col. |
| `768px – 1023px` | 2-col dashboard grid. Hero stacks (image below text). |
| `< 768px` | 1-col everything. Navbar collapses to hamburger menu. Journal cards full width. |

---

## 9. Animation & Transition Rules

- All button hovers: `transition: all 0.15s ease`
- All card hovers: `transition: box-shadow 0.2s, transform 0.15s`
- Page transitions: fade-in `opacity 0 → 1, 0.2s`
- Mood bar fill: `transition: width 0.4s ease` on mount
- Skeleton shimmer: `1.4s infinite` (see 5.8)
- Toast slide-up: `translateY(20px) → 0, 0.25s ease`
- No animations on reduced-motion: `@media (prefers-reduced-motion: reduce) { * { animation: none; transition: none; } }`

---

*MindTrack AI Design Document — ZLAQA Internship 2026*
