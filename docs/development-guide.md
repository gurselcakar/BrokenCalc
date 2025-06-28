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

### Core Gameplay (48-Hour Build Plan)
- **The "Break"**: Calculator buttons are randomly remapped at game start
- **Discovery Mechanic**: Players must figure out which button does what by trial
- **Single Problem Focus**: One math problem per 2-minute session
- **Time Pressure**: 2 minutes to solve ONE problem
- **Victory Condition**: Press `=` with correct answer to win immediately

### Game Flow
1. **Home Screen**: Difficulty selection, How to Play, (Leaderboard if time allows)
2. **Game Session**: Single problem displayed, 2-minute countdown
3. **Button Discovery**: Players learn mappings through calculator experimentation
4. **Win Condition**: Solve the problem correctly before time runs out
5. **Scoring**: Purely time-based (remaining seconds = final score)
6. **Time-Out**: Calculator displays silly message, then game over screen

### Difficulty Levels & Scrambling Rules

**Problem Display**: Shows at top of screen (e.g., `_ + _ = 2`)
**Answer Method**: Type full operation (number + operator + number) then press `=`
**Calculator Display**: Works like normal calculator - shows what you type, has delete button

#### **Easy Mode** 
- **Scrambled**: Only numbers (0-9) mixed among themselves
- **Normal**: All operators (+, -, ×, ÷), equals, delete work as expected
- **Extra Feature**: Discovery log modal showing learned button mappings
- **Problems**: Single digit addition/subtraction only (e.g., `_ + _ = 7`, `_ - _ = 3`)
- **Operations**: Only `+` and `-` used

#### **Medium Mode**
- **Scrambled**: Numbers (0-9) mixed among themselves, operators (+, -, ×, ÷) mixed among themselves  
- **Normal**: Delete button always works
- **No Discovery Log**: Players must remember mappings
- **Problems**: Single digit with all operations (e.g., `_ × _ = 12`, `_ ÷ _ = 3`)
- **Operations**: All four operators (`+`, `-`, `×`, `÷`) used

#### **Hard Mode**
- **Scrambled**: Numbers and operators can be mixed together (1 might be +, + might be 7)
- **Normal**: Delete button always works
- **Problems**: Two-digit operations (e.g., `_ _ + _ _ = 35`, `_ _ × _ = 42`)
- **Operations**: All four operators with multi-digit numbers

#### **Hardcore Mode**
- **Scrambled**: Everything mixed together (numbers, operators, equals)
- **Normal**: Only delete button works as expected
- **Problems**: Most challenging operations

#### **God Tier Mode** (Easter Egg - End of Hackathon)
- **Scrambled**: Everything including display (press 1, might be 1 but displays 2)
- **Challenge**: Single "impossible" problem
- **Purpose**: Hilarious Easter egg for brave souls

### Core Features (Priority Order)
1. **Simple Calculator Layout**: 3x5 mobile-friendly grid
2. **Button Scrambling**: Mode-specific random mappings
3. **Problem Generation**: Math equations with multiple solutions
4. **Timer System**: 2-minute countdown with silly time-out messages
5. **Scoring**: Time-based (remaining seconds = score)
6. **Reddit-Style UI**: Arcade-y theme with username welcome

### Proposed Calculator Layout (Mobile-Optimized)
```
[⌫]         [÷]
[7] [8] [9] [×]
[4] [5] [6] [-]
[1] [2] [3] [+]
    [0]     [=]
```
Clean, thumb-friendly, all essential buttons only.

## Implementation Phases (48-Hour Timeline)

### Phase 1: Core Game Structure (Day 1 - Hours 1-12)
**Priority: MUST HAVE**
**Files to create/modify:**
- `src/client/components/Calculator.tsx` - Main calculator with scrambled buttons
- `src/client/components/GameScreen.tsx` - Game session interface
- `src/client/components/HomeScreen.tsx` - Start screen
- `src/shared/types/game.ts` - Game state and problem types

**Core functionality:**
```typescript
// Difficulty modes with specific scrambling rules
type DifficultyMode = 'easy' | 'medium' | 'hard' | 'hardcore' | 'godtier';

// Button mapping system with mode-specific logic
interface ButtonMapping {
  numbers: { [key: string]: string }; // '1' -> '7', '2' -> '0', etc.
  operators: { [key: string]: string }; // '+' -> '×', '-' -> '÷', etc.
  display?: { [key: string]: string }; // For god-tier mode only
}

// Game state (single problem focus)
interface GameState {
  mode: DifficultyMode;
  problem: MathProblem;
  buttonMapping: ButtonMapping;
  calculatorDisplay: string;
  timeRemaining: number; // 120 seconds
  gameStatus: 'playing' | 'won' | 'timeup';
  discoveredMappings: string[]; // For easy mode discovery log
  finalScore?: number; // Set when game ends
}

// Math problem structure
interface MathProblem {
  equation: string; // "_ + _ = 7"
  targetValue: number; // 7
  possibleSolutions: string[]; // ["1+6", "2+5", "3+4", etc.]
  difficulty: DifficultyMode;
}

// Calculator button types
interface CalculatorButton {
  id: string; // '1', '2', '+', '-', '=', 'delete'
  displayLabel: string; // What user sees on button
  actualValue: string; // What it actually does when pressed
  type: 'number' | 'operator' | 'action';
}
```

### Phase 2: Game Logic & Scrambling (Day 1 - Hours 13-24)
**Priority: MUST HAVE**
**Files to create/modify:**
- `src/client/hooks/useGameLogic.ts` - Game state management
- `src/client/utils/problemGenerator.ts` - Math problem creation with multiple solutions
- `src/client/utils/buttonScrambler.ts` - Mode-specific scrambling logic
- `src/client/components/Timer.tsx` - Countdown display
- `src/client/components/DiscoveryLog.tsx` - Easy mode button mapping modal

**Key Scrambling Logic:**
```typescript
// Mode-specific scrambling functions
const scramblers = {
  easy: () => scrambleNumbers(), // Only 0-9
  medium: () => ({ 
    numbers: scrambleNumbers(), 
    operators: scrambleOperators() 
  }),
  hard: () => scrambleNumbersAndOperators(), // Mixed together
  hardcore: () => scrambleEverything(), // All except delete
  godtier: () => scrambleEverythingIncludingDisplay()
};
```

### Phase 3: Scoring & Polish (Day 2 - Hours 25-36)
**Priority: SHOULD HAVE**
**Files to create/modify:**
- `src/server/api/scores.ts` - Score persistence
- `src/client/components/GameOver.tsx` - End game screen
- `src/client/utils/scoring.ts` - Score calculation logic

### Phase 4: Nice-to-Have Features (Day 2 - Hours 37-48)
**Priority: COULD HAVE (if time allows)**
**Files to create/modify:**
- `src/client/components/Leaderboard.tsx` - High scores display
- `src/client/components/HowToPlay.tsx` - Instructions modal
- Enhanced animations and sound effects

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
// Game sessions (kept simple for 48-hour timeline)
POST /api/game/start          // Start new game session with difficulty mode
POST /api/game/submit-answer  // Submit equation answer for validation
POST /api/game/end            // End game session and calculate final score

// Scoring (if time allows)
POST /api/scores/submit       // Submit final score with mode/time/problems solved
GET  /api/scores/leaderboard  // Get top scores by difficulty mode
GET  /api/scores/personal     // Get user's personal bests

// Problem generation (server-side for consistency)
GET  /api/problems/generate   // Generate new math problem for current mode
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

## Final Project Structure (48-Hour Build)

```
src/
├── client/
│   ├── components/
│   │   ├── HomeScreen.tsx          // Game mode selection + how to play
│   │   ├── GameScreen.tsx          // Main game interface
│   │   ├── Calculator.tsx          // Calculator with scrambled buttons
│   │   ├── Timer.tsx               // 2-minute countdown
│   │   ├── GameOver.tsx            // End game results
│   │   ├── DiscoveryLog.tsx        // Easy mode button mapping modal
│   │   └── Leaderboard.tsx         // High scores (if time allows)
│   ├── hooks/
│   │   ├── useGameLogic.ts         // Game state management
│   │   └── useCalculator.ts        // Calculator display logic
│   ├── utils/
│   │   ├── buttonScrambler.ts      // Mode-specific scrambling
│   │   ├── problemGenerator.ts     // Math problem creation
│   │   └── scoring.ts              // Score calculation
│   └── App.tsx                     // Main app router
├── server/
│   ├── api/
│   │   ├── game.ts                 // Game session endpoints
│   │   ├── problems.ts             // Problem generation
│   │   └── scores.ts               // Leaderboard (if time allows)
│   └── index.ts
├── shared/
│   └── types/
│       └── game.ts                 // All shared interfaces
└── devvit/
    └── main.tsx                    // Reddit post integration
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