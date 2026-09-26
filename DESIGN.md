---
name: Forked Recipe Book
description: An ad-free, minimal personal recipe collection for calm everyday cooking.
colors:
  background: "hsl(42 38% 98%)"
  foreground: "hsl(150 22% 15%)"
  oat-paper: "hsl(42 45% 95%)"
  oat-neutral: "hsl(42 52% 97%)"
  herb-primary: "hsl(149 31% 25%)"
  herb-secondary-text: "hsl(150 11% 34%)"
  persimmon-accent: "hsl(18 64% 48%)"
  sage-wash: "hsl(145 18% 92%)"
  muted-text: "hsl(150 8% 39%)"
  border: "hsl(42 18% 84%)"
  destructive: "hsl(0 84.2% 60.2%)"
typography:
  display:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(2.75rem, 7vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(2.25rem, 4vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.2
  title:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
rounded:
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  pill: "9999px"
spacing:
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  6: "1.5rem"
  8: "2rem"
  16: "4rem"
  20: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.herb-primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    height: "2.5rem"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.herb-primary}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    height: "2.5rem"
  card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  input-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
    height: "2.5rem"
  badge-accent:
    backgroundColor: "hsl(18 64% 48% / 0.1)"
    textColor: "{colors.persimmon-accent}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.625rem"
---

# Design System: Forked Recipe Book

## Overview

**Creative North Star: "The Calm Pantry"**

Forked Recipe Book is a quiet personal utility, not a content marketplace. Its visual system makes recipes feel kept and useful: oat-toned surfaces, a deep herb-ink working color, a quietly expressive display face, and a deliberately small set of dependable controls. A rare persimmon accent adds a small human spark.

The interface is minimal without becoming sterile. Content gets generous space, cards stay plain, and responsive behavior preserves straightforward scanning. Illustration, when owned and introduced, should feel like a small pantry companion rather than generic food photography or decorative stock content.

**Key Characteristics:**

- Oat-toned foundations with a deep herb-ink working color.
- Flat-by-default utility surfaces with soft lift only where state or grouping needs it.
- Friendly, tactile controls with rounded but compact geometry.
- DM Serif Display for memorable headings and DM Sans for effortless reading.

## Colors

The palette starts with oat paper and herb ink, then uses persimmon only as a lightweight highlight.

### Primary

- **Herb Ink:** the default action and primary button color; use it for a user’s next meaningful step and key interactive text.

### Secondary

- **Sage Wash:** a calm, low-contrast support surface for secondary actions and hover states.

### Tertiary

- **Persimmon:** a rare highlight for accent badges and small moments of discovery, never a dominant page field.

### Neutral

- **Oat Paper:** the lightly tinted backdrop for broad landing-page sections and calm visual breathing room.
- **Clean Counter:** the lifted oat-white surface for cards, fields, popovers, and default page space.
- **Herb Ink:** the deep green reading color for headings and primary content.
- **Quiet Label:** muted green-gray text for supporting detail and metadata.
- **Soft Edge:** the warm neutral divider and field border color.

### Named Rules

**The One Spark Rule.** Persimmon is an accent, not a competing primary color. Use it for small badges and clear highlights; Herb Ink remains the working color.

## Typography

**Display Font:** DM Serif Display (with Georgia fallback)
**Body Font:** DM Sans (with UI sans-serif fallback)

**Character:** Gentle editorial warmth above a clean, practical UI voice. The type supports recipe names, instructions, and quantities without sacrificing scanning speed.

### Hierarchy

- **Display:** expressive, tight headline type for the hero and major landing moments.
- **Headline:** expressive section headings that create a clear route through long pages.
- **Title:** semibold card and panel titles.
- **Body:** regular, relaxed text for descriptions and instructions.
- **Label:** medium-weight compact text for controls, navigation, and supporting UI.

### Named Rules

**The Readable Recipe Rule.** Prefer the simplest established weight and size that makes recipe content scannable; decorative type must never compete with ingredients or steps.

## Layout

Content centers in a wide container that tops out at 1400px, with 2rem horizontal padding at the largest breakpoint. Page sections use generous 5rem vertical spacing and headings receive more separation from their content than their own internal text. Landing content is often centered; application workspaces favor straightforward responsive grids and stacks. On small screens, preserve clear one-column reading and full-width actions rather than squeezing dense controls side by side.

## Elevation & Depth

The system is flat by default. White cards use a pale border and a small ambient shadow to separate from the page without looking floaty. The navigation gains stronger shadow and translucent blur only after scroll, where it becomes a temporary floating tool rather than permanent decoration.

### Shadow Vocabulary

- **Card lift:** `0 1px 2px 0 rgb(0 0 0 / 0.05)`: quiet separation for persistent content containers.
- **Scrolled navigation lift:** a large diffuse shadow: reserved for the floating navigation state.

### Named Rules

**The Earned Lift Rule.** Elevation appears to clarify hierarchy or interaction state, never to make every surface look important.

## Shapes

The form language is gently curved and compact: 8px for cards, 6px for standard controls, 4px for the smallest controls, 12px for the scrolled navigation shell, and fully rounded pills for badges. Borders are thin and pale; components should read as approachable tools, not glossy objects.

## Components

### Buttons

- **Character:** compact, friendly action controls.
- **Shape:** gently rounded controls (6px); large controls retain the same compact corner language.
- **Primary:** Herb Ink background with light text; the standard size is 40px tall with 16px horizontal padding.
- **Hover / Focus:** primary buttons darken slightly on hover; every interactive button shows a 2px ring with offset when keyboard-focused.
- **Secondary / Ghost:** outline buttons use a Soft Edge border and Herb Ink text; secondary and ghost controls use Sage Wash on hover.

### Chips

- **Style:** fully rounded labels with a faint tinted background and matching low-opacity border.
- **State:** Persimmon marks accents; Herb Ink marks subtle informational tags.

### Cards / Containers

- **Corner Style:** gently curved (8px).
- **Background:** Clean Counter on the default page surface.
- **Shadow Strategy:** a single low ambient shadow, paired with a pale border.
- **Internal Padding:** generous 24px for headers and content.

### Inputs / Fields

- **Style:** white field, pale Soft Edge stroke, gentle 6px radius, 40px minimum height.
- **Focus:** 2px keyboard focus ring with an offset; no ornamental glow.
- **Disabled:** reduced opacity and a blocked cursor.

### Navigation

- **Style:** full-width, compact header with simple wordmark, action buttons, and a profile/login entry point.
- **State:** at rest it is flat and border-led; after scroll it becomes an inset, translucent floating bar with blur and stronger lift.
- **Mobile:** account controls move into a sheet while actions remain clear and touch-sized.

## Do's and Don'ts

### Do:

- **Do** let recipes, ingredients, and instructions remain the strongest content on any working screen.
- **Do** use Oat Paper for broad breathing spaces and Clean Counter for interactive surfaces.
- **Do** reserve Persimmon for small highlights and Herb Ink for meaningful actions.
- **Do** use borders and spacing before adding shadows to explain hierarchy.
- **Do** favor owned Notion-like illustration selectively over user-uploaded food imagery.

### Don't:

- **Don't** introduce ads, noisy promotional modules, or marketplace-style clutter.
- **Don't** make Persimmon the dominant background, button, or navigation color.
- **Don't** add user-uploaded recipe photography as a default content layer.
- **Don't** stack large shadows or glossy effects onto everyday cards and fields.
- **Don't** compress recipe instructions or ingredient lists merely to make a layout feel denser.
