# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Žluté Auto" (Yellow Car) is a real-time multiplayer web game where players compete to spot yellow cars during road trips. Built with Next.js 15, React 19, and Firebase Firestore, it features live score synchronization, achievement notifications, and sound effects.

## Development Commands

```bash
# Development (with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

The app runs on http://localhost:3000 by default.

## Required Environment Variables

Create `.env.local` in the root directory with Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

**Important**: The app validates these at startup in `lib/firebase.ts` and will throw an error if `apiKey` or `projectId` are missing.

## Architecture

### Data Flow & Real-time Synchronization

The application uses Firebase Firestore for real-time multiplayer state:

1. **Game Creation** (`lib/game.ts`):
   - `createGame(playerNames)` generates a unique game ID
   - Creates a Firestore document at `/games/{gameId}`
   - Each player gets assigned a color from `PLAYER_COLORS` array
   - Returns gameId for URL routing

2. **Real-time Updates** (`lib/hooks/useGame.ts`):
   - `useGame` hook subscribes to two Firestore listeners:
     - `subscribeToGame(gameId)` - watches `/games/{gameId}` for score changes
     - `subscribeToGameEvents(gameId)` - watches `/games/{gameId}/events` subcollection
   - **Critical**: Always cleanup subscriptions in useEffect return to prevent memory leaks
   - Updates trigger immediate React state changes across all connected clients

3. **Point Addition** with Rate Limiting:
   - Client-side rate limiting: 2-second cooldown per player (in-memory `lastPointTime` map in `lib/game.ts`)
   - `addPoint(gameId, playerId)` updates both game score and adds event to subcollection
   - Error handling displays friendly Czech toast messages

### Firestore Data Structure

```
/games/{gameId}
  - id: string
  - createdAt: number (timestamp)
  - updatedAt: number (timestamp)
  - players: Record<string, Player>
    - player_0, player_1, etc.
      - id: string
      - name: string
      - score: number
      - color: string

/games/{gameId}/events/{eventId}
  - id: string
  - playerId: string
  - playerName: string
  - timestamp: number
  - type: 'point_added'
```

### Component Organization

**Page Components:**
- `app/page.tsx` - Game creation form, validates 2-6 players, max 20 chars per name
- `app/game/[gameId]/page.tsx` - Main game interface with real-time updates

**UI Components** (all in `/components`):
- `PlayerButton.tsx` - Shows score temporarily (2s) after click with animation
- `ScoreDisplay.tsx` - Live leaderboard with medals (🥇🥈🥉) and leader highlighting
- `GameHistory.tsx` - Event log showing recent point additions
- `GameMenu.tsx` - Hamburger menu with share, new game, and about modal
- `Achievement.tsx` - Milestone popup (1, 5, 10, 20, 50, 100 points)
- `Toast.tsx` - Error/success notifications (especially rate limit errors)
- `FloatingParticles.tsx` - Animated background with emoji particles and light beams
- `GradientMesh.tsx` - Animated gradient background mesh

### Sound System (`lib/sounds.ts`)

Uses Web Audio API with programmatic tone generation:
- **point** - C major chord (523Hz, 659Hz, 784Hz) with reverb
- **achievement** - Ascending arpeggio (C-E-G-C-E6) with sparkle effect
- **error** - Low dissonant tone (200Hz + 210Hz)

All sounds fail silently if AudioContext is unavailable. No external audio files needed.

### Styling System

**Tailwind CSS v4** with custom yellow theme in `app/globals.css`:
- Custom CSS variables: `--yellow-primary`, `--yellow-secondary`, etc.
- Inline theme with `@theme inline` directive
- Custom animations: `float`, `glow`, `shimmer`, `slideIn`, `bounce`, `pulse-scale`
- Glassmorphism utility classes: `.glass`, `.glass-strong`
- **Car emoji coloring**: All 🚗 emojis use `filter: sepia(100%) saturate(400%) brightness(100%) hue-rotate(-10deg)` to convert red to yellow

**Framer Motion** for animations:
- Used in headers, buttons, score displays, particles
- All motion components use `initial`, `animate`, `transition` props
- Key prop on score numbers for re-animation on value change

### TypeScript Types (`types/game.ts`)

Three core interfaces:
- `Player` - Individual player state
- `GameEvent` - Event log entries
- `Game` - Top-level game state with players Record

**Note**: Removed unused `GameWithEvents` type during cleanup.

## Code Quality Standards

### Console Logging
- **Production code**: Only use `console.error()` for errors
- Remove all `console.log()` and `console.info()` from production code
- Scripts in `/scripts` can use console.log for build-time output

### ESLint
- Escape quotes in JSX with `&ldquo;` and `&rdquo;` (not raw `"`)
- Build will fail on ESLint errors

### Dependencies
This project uses minimal dependencies:
- No CSS-in-JS utility libraries (removed clsx, tailwind-merge, class-variance-authority)
- No custom utility functions - deleted `lib/utils.ts`
- `sharp` is in devDependencies (build-time only for image optimization)

### State Management
- Avoid unused state variables - cleanup immediately
- Remove commented/dead code - don't leave it for "later"
- Each player button manages its own `showScore` state (2s visibility after click)

## Firebase Security

### Security Rules Setup

**IMPORTANT**: Before deploying to production (Vercel), you MUST set up Firestore Security Rules!

**Files**:
- `firestore.rules` - Complete security rules configuration
- `FIREBASE_SECURITY_SETUP.md` - Detailed setup instructions

### How to Deploy Security Rules

1. Open Firebase Console: https://console.firebase.google.com/
2. Go to **Firestore Database** → **Rules**
3. Copy entire contents of `firestore.rules`
4. Paste into Firebase Console editor
5. Click **Publish**

### What Security Rules Do

**Protection against**:
- ✅ Server-side rate limiting (1 second minimum between updates)
- ✅ Invalid data (scores, player counts, names)
- ✅ Game deletion
- ✅ Player manipulation after game creation
- ✅ Invalid ratings (must be 1-5 stars)
- ✅ Database spam and attacks

**Rate Limiting**:
- Client-side: 2 seconds (UX, user-friendly error)
- Server-side: 1 second (security, enforced by Firebase)

**Note**: Without Security Rules, your database is **completely open** - anyone can read, write, or delete all data!

## Common Patterns

### Adding New Components
1. Create in `/components` directory
2. Use `'use client'` directive if using hooks or browser APIs
3. Import types from `@/types/game`
4. Apply yellow theme colors via Tailwind classes or CSS variables
5. Add Framer Motion for animations if needed

### Modifying Game Logic
1. Game state changes go through `lib/game.ts` functions
2. Update Firestore first, let real-time listeners propagate changes
3. Handle errors with user-friendly Czech messages
4. Test rate limiting behavior (2s cooldown)

### Working with Animations
1. Global keyframes defined in `app/globals.css`
2. Component-specific animations use Framer Motion
3. All car emojis 🚗 must have yellow filter applied
4. Maintain performance - avoid excessive re-renders in particle systems

## Tech Stack

- **Next.js 15.5.4** - App Router, Turbopack, React 19
- **Firebase 12.3.0** - Firestore for real-time database
- **Framer Motion 12.23.22** - Animation library
- **Tailwind CSS 4** - Utility-first styling with custom theme
- **TypeScript 5** - Type safety
