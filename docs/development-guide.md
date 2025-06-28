# BrokenCalc - Development Guide

This guide will help you start developing **BrokenCalc** after completing the template cleanup.

## Project Overview

BrokenCalc is a quirky calculator game where the calculator is "broken" in interesting ways, creating challenges and entertainment for users on Reddit.

## Architecture

The project follows the Devvit architecture with three main components:

### 1. **Devvit App** (`/src/devvit`)
- Runs within Reddit's feed
- Handles post creation and Reddit integration
- Uses Devvit UI components (no React)
- Access to Reddit APIs through context

### 2. **Client Webview** (`/src/client`)
- Full-screen React application
- Main game interface
- Communicates with server via fetch API
- Styled with Tailwind CSS

### 3. **Server** (`/src/server`)
- Serverless Node.js backend
- Handles game logic and data persistence
- Redis integration for state management
- Express.js for API endpoints

### 4. **Shared** (`/src/shared`)
- Common types and utilities
- Shared between all three components

## Getting Started

### Prerequisites

1. **Reddit Account**: You need a Reddit account with a test subreddit
2. **Node.js**: Ensure Node.js is installed
3. **Devvit CLI**: Installed via the template

### Initial Setup

1. **Authentication**:
   ```bash
   npm run login
   ```

2. **Initialize Devvit App**:
   ```bash
   npm run devvit:init
   ```

3. **Update Subreddit**: Edit `package.json` and replace `BrokenCalc` in the `dev:devvit` script with your test subreddit name

4. **Start Development**:
   ```bash
   npm run dev:all
   ```

## Development Workflow

### Local Development
- **Client Preview**: `http://localhost:7474` (React app preview)
- **Server**: Runs automatically with hot reload
- **Devvit**: Test in your Reddit subreddit

### Testing Your App
1. Navigate to your test subreddit on Reddit
2. Click the three dots menu → "BrokenCalc: New Post"
3. Create a post to test your app with full functionality

## BrokenCalc Game Concept

### Core Gameplay
- Players use a calculator interface
- The calculator has various "broken" behaviors
- Players must adapt to complete mathematical challenges
- Scoring based on successful calculations despite the broken behavior

### Potential "Broken" Behaviors
- **Random Operations**: Plus becomes minus randomly
- **Digit Swapping**: Numbers get swapped (7 becomes 1)
- **Memory Issues**: Calculator "forgets" previous operations
- **Display Glitches**: Shows wrong numbers briefly
- **Button Lag**: Delayed response to button presses
- **Auto-Clear**: Randomly clear the display
- **Operator Chaos**: Operations change mid-calculation

### Game Features to Implement
1. **Calculator Interface**: Basic calculator layout
2. **Challenge System**: Present math problems to solve
3. **Broken Mechanics**: Implement quirky calculator behaviors
4. **Scoring System**: Track successful calculations
5. **Leaderboards**: Reddit-integrated high scores
6. **Daily Challenges**: New problems each day

## Implementation Phases

### Phase 1: Basic Calculator
**Files to create/modify:**
- `src/client/components/Calculator.tsx` - Main calculator component
- `src/client/components/Display.tsx` - Calculator display
- `src/client/components/Button.tsx` - Calculator buttons
- `src/shared/types/calculator.ts` - Calculator state types

**Basic calculator functionality:**
```typescript
// Example calculator state
interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForOperand: boolean;
}
```

### Phase 2: Game Logic
**Files to create/modify:**
- `src/server/api/game.ts` - Game management endpoints
- `src/server/api/challenges.ts` - Challenge generation
- `src/shared/types/game.ts` - Game state types
- `src/client/components/Challenge.tsx` - Challenge display

**Game state management:**
```typescript
// Example game state
interface GameState {
  currentChallenge: Challenge;
  score: number;
  timeRemaining: number;
  brokenBehavior: BrokenBehavior;
}
```

### Phase 3: Broken Mechanics
**Files to create/modify:**
- `src/client/hooks/useBrokenCalculator.ts` - Broken behavior logic
- `src/shared/types/broken-behaviors.ts` - Behavior definitions
- `src/client/utils/calculator-chaos.ts` - Chaos implementations

### Phase 4: Scoring & Persistence
**Files to create/modify:**
- `src/server/api/scores.ts` - Score management
- `src/server/models/player.ts` - Player data
- `src/client/components/Leaderboard.tsx` - Score display

## Development Tips

### Client Development
- Use React hooks for state management
- Leverage Tailwind for responsive design
- Test responsive layouts for Reddit's webview
- Use vibrant colors to match the game theme

### Server Development
- Use Redis for game state persistence
- Implement proper error handling
- Keep endpoints simple and focused
- Use TypeScript for type safety

### Devvit Integration
- Never use React in Devvit components
- Use Devvit UI blocks for Reddit integration
- Access Reddit context for user data
- Handle post creation gracefully

### Styling Guidelines
- **Color Palette**: Vibrant gradients (purple, pink, orange)
- **Typography**: Bold, playful fonts
- **Layout**: Mobile-first responsive design
- **Animations**: Smooth transitions for broken behaviors

## API Endpoints to Implement

```typescript
// Game management
GET  /api/game/start          // Start new game
POST /api/game/move           // Submit calculator action
GET  /api/game/state          // Get current game state

// Challenges
GET  /api/challenges/daily    // Get daily challenge
GET  /api/challenges/random   // Get random challenge

// Scoring
POST /api/scores/submit       // Submit final score
GET  /api/scores/leaderboard  // Get top scores
GET  /api/scores/user         // Get user's best scores
```

## Testing Strategy

### Unit Tests
- Calculator logic functions
- Broken behavior implementations
- Score calculations

### Integration Tests  
- API endpoint functionality
- Client-server communication
- Redis data persistence

### Manual Testing
- Test in actual Reddit subreddit
- Verify mobile responsiveness
- Check all broken behaviors
- Validate scoring accuracy

## Deployment

1. **Build the client**:
   ```bash
   npm run build:client
   ```

2. **Deploy to Reddit**:
   ```bash
   npm run deploy
   ```

3. **Test in production** on your subreddit

## Project Structure After Development

```
src/
├── client/
│   ├── components/
│   │   ├── Calculator.tsx
│   │   ├── Display.tsx
│   │   ├── Button.tsx
│   │   ├── Challenge.tsx
│   │   └── Leaderboard.tsx
│   ├── hooks/
│   │   └── useBrokenCalculator.ts
│   ├── utils/
│   │   └── calculator-chaos.ts
│   └── App.tsx
├── server/
│   ├── api/
│   │   ├── game.ts
│   │   ├── challenges.ts
│   │   └── scores.ts
│   ├── models/
│   │   └── player.ts
│   └── index.ts
├── shared/
│   └── types/
│       ├── calculator.ts
│       ├── game.ts
│       └── broken-behaviors.ts
└── devvit/
    └── main.tsx
```

## Resources

- [Devvit Documentation](https://developers.reddit.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Getting Help

- Join the [Devvit Discord](https://discord.com/invite/Cd43ExtEFS)
- Ask questions in **#devvit-vibe-coding**
- Check existing Reddit developer examples

Happy coding! 🧮✨ 