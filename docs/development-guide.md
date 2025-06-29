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

### Game Flow (Seamless Experience)
1. **Vintage Calculator Home Screen** ✅ **(PHASE 1 COMPLETE)**
   - Welcome sequence with Reddit username
   - Menu navigation (PLAY → HOW TO PLAY → LEADERBOARD)
   - Difficulty selection with vintage calculator aesthetic
   - All within authentic CASIO fx-85GT X CLASSWIZ display
2. **Game Transition**: "GAME START" message (2 seconds) → Timer starts (2:00)
3. **Game Session**: 
   - **LCD Layout**: Timer (top-left), Equation (top-center), Input (bottom-right), Feedback (bottom-left)
   - **Real-time equation building**: Shows `3` → `3+` → `3+4` as user types
   - Navigation buttons disappear during gameplay
4. **Wrong Answer Flow**: Result displayed → "INCORRECT" in bottom-left → Clears on keypress
5. **Victory Flow**: Result displayed → Timer stops immediately → Victory screen within LCD
6. **Seamless Flow**: All screens within LCD display maintaining calculator aesthetic

### Difficulty Levels & Scrambling Rules

**LCD Display Layout**: 
- **Timer**: Top-left corner (2:00 countdown)
- **Equation**: Top-center (e.g., `_ + _ = 7`)
- **User Input**: Bottom-right (real-time equation building: `3` → `3+` → `3+4`)
- **Feedback**: Bottom-left corner ("INCORRECT" messages)

**Answer Method**: Type full operation (number + operator + number) then press `=`
**Calculator Display**: Shows equation building like real calculator, with authentic result display

#### **Easy Mode** 
- **Scrambled**: Only numbers (0-9) mixed among themselves
- **Normal**: All operators (+, -, ×, ÷), equals, delete work as expected
- **~~Extra Feature~~**: ~~Discovery log modal~~ **(REMOVED FROM SCOPE)**
- **Problems**: Single digit addition/subtraction only (e.g., `_ + _ = 7`, `_ - _ = 3`)
- **Operations**: Only `+` and `-` used
- **Feedback**: Wrong answers show "INCORRECT" in bottom-left corner until next keypress

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
1. **✅ Vintage Calculator Home Screen** *(Phase 1 Complete)*
   - Authentic CASIO fx-85GT X CLASSWIZ design with solar panel
   - Green-on-black LCD aesthetic with scanlines and glow effects
   - Multi-platform navigation (touch, mouse, keyboard)
   - Scrollable content for How to Play and Leaderboard
2. **5x4 Calculator Layout**: Mobile-friendly grid with vintage styling
3. **Button Scrambling**: Mode-specific random mappings (backend only)
4. **Problem Generation**: Math equations with multiple solutions
5. **Timer System**: 2-minute countdown with "GAME START" sequence
6. **Seamless Experience**: All within LCD display for smooth flow
7. **Real Calculator Behavior**: Authentic equation building and feedback

### Calculator Layout (Mobile-Optimized 5x4 Grid)
```
[⌫] [⌫] [⌫] [÷]
[7] [8] [9] [×]
[4] [5] [6] [-]
[1] [2] [3] [+]
[ ] [0] [ ] [=]
```
- **Delete button spans 3 cells** for easy thumb access
- **0 button centered with empty neighbors** for clean layout
- **Static frontend display** - buttons show correct labels always
- **Backend scrambling** - actual button behavior scrambled server-side
- **Vintage Casio aesthetic** matching home screen design

## Implementation Phases (48-Hour Timeline)

### ✅ Phase 1: Vintage Calculator Home Screen (COMPLETE)
**Status: IMPLEMENTED AND TESTED**
**Files created:**
- ✅ `src/client/components/HomeScreen.tsx` - Main home screen with menu navigation
- ✅ `src/client/components/CalculatorDisplay.tsx` - Vintage LCD display with CASIO branding
- ✅ `src/client/components/WelcomeSequence.tsx` - Username welcome with authentic startup
- ✅ `src/client/components/MenuNavigation.tsx` - Multi-platform navigation controls
- ✅ `src/client/components/DifficultySelection.tsx` - Game difficulty selection
- ✅ `src/client/components/ComingSoon.tsx` - Placeholder for game functionality
- ✅ `src/client/components/HowToPlay.tsx` - Scrollable game instructions
- ✅ `src/client/components/Leaderboard.tsx` - Scrollable leaderboard display
- ✅ `src/client/components/ScrollableContent.tsx` - Reusable scrolling wrapper
- ✅ `src/client/hooks/useMenuNavigation.ts` - Complete navigation state management
- ✅ `src/client/styles/vintage-calculator.css` - Authentic Casio styling
- ✅ `src/shared/types/navigation.ts` - All navigation and screen types

### Phase 2: Easy Mode Implementation (CURRENT FOCUS)
**Priority: MUST HAVE**
**Files to create/modify:**
- `src/client/components/Calculator.tsx` - 5x4 calculator with vintage styling
- `src/client/components/GameScreen.tsx` - Seamless transition to calculator interface
- `src/client/components/GameDisplay.tsx` - LCD layout for game mode
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
  // discoveredMappings: string[]; // REMOVED - No discovery log in final design
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

### Phase 2 Continued: Game Logic & Scrambling
**Priority: MUST HAVE**
**Files to create/modify:**
- `src/client/hooks/useGameLogic.ts` - Game state with seamless flow management
- `src/client/utils/problemGenerator.ts` - Math problems with smart validation
- `src/client/utils/buttonScrambler.ts` - Backend-only scrambling logic
- `src/client/components/FeedbackDisplay.tsx` - Wrong answer feedback system
- `src/client/components/VictoryScreen.tsx` - Victory screen within LCD display
- `src/client/components/GameOver.tsx` - Timeout screen with vintage styling
- ~~`src/client/components/DiscoveryLog.tsx`~~ - **(REMOVED FROM SCOPE)**

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

## Current Project Structure

```
src/
├── client/
│   ├── components/
│   │   ├── HomeScreen.tsx          // ✅ Main home screen with menu navigation
│   │   ├── CalculatorDisplay.tsx   // ✅ Vintage LCD display with CASIO branding
│   │   ├── WelcomeSequence.tsx     // ✅ Username welcome with startup sequence
│   │   ├── MenuNavigation.tsx      // ✅ Multi-platform navigation controls
│   │   ├── DifficultySelection.tsx // ✅ Game difficulty selection screen
│   │   ├── ComingSoon.tsx          // ✅ Placeholder for game functionality
│   │   ├── HowToPlay.tsx           // ✅ Scrollable game instructions
│   │   ├── Leaderboard.tsx         // ✅ Scrollable leaderboard display
│   │   ├── ScrollableContent.tsx   // ✅ Reusable scrolling wrapper
│   │   ├── GameScreen.tsx          // 🔲 Seamless transition to calculator interface
│   │   ├── Calculator.tsx          // 🔲 5x4 calculator with vintage styling
│   │   ├── GameDisplay.tsx         // 🔲 LCD layout for game mode
│   │   ├── FeedbackDisplay.tsx     // 🔲 Wrong answer feedback system
│   │   ├── VictoryScreen.tsx       // 🔲 Victory screen within LCD display
│   │   └── GameOver.tsx            // 🔲 Timeout screen with vintage styling
│   ├── hooks/
│   │   ├── useMenuNavigation.ts    // ✅ Complete navigation state management
│   │   ├── useGameLogic.ts         // 🔲 Game state with seamless flow management
│   │   └── useCalculator.ts        // 🔲 Calculator display logic with scrambling
│   ├── styles/
│   │   └── vintage-calculator.css  // ✅ Authentic Casio styling with responsive design
│   ├── utils/
│   │   ├── buttonScrambler.ts      // 🔲 Backend-only scrambling logic
│   │   ├── problemGenerator.ts     // 🔲 Math problems with smart validation
│   │   └── scoring.ts              // 🔲 Score calculation (later phases)
│   ├── assets/                     // ✅ Bolt badge assets
│   ├── App.tsx                     // ✅ Main app with HomeScreen integration
│   ├── BoltBadge.tsx              // ✅ Bolt branding component
│   ├── global.ts                   // ✅ Global type definitions
│   ├── index.css                   // ✅ Global styles
│   ├── main.tsx                    // ✅ React app entry point
│   └── module.d.ts                // ✅ Module declarations
├── server/
│   ├── api/
│   │   ├── game.ts                 // 🔲 Game session endpoints
│   │   ├── problems.ts             // 🔲 Problem generation
│   │   └── scores.ts               // 🔲 Leaderboard (later phases)
│   └── index.ts                    // 🔲 Express server setup
├── shared/
│   └── types/
│       ├── navigation.ts           // ✅ All navigation and screen types
│       └── game.ts                 // 🔲 Game state and problem types
└── devvit/
    └── main.tsx                    // ✅ Reddit post integration (basic setup)
```

**Legend:**
- ✅ **Implemented** (Phase 1 Complete)
- 🔲 **To Implement** (Phase 2 Focus)

### Key Files Status:

#### **✅ Phase 1 Complete (11 components + styling)**
All home screen navigation, vintage calculator display, and user experience flow

#### **🔲 Phase 2 Remaining (10 files)**
Game mechanics, calculator logic, and backend integration

#### **📁 Additional Structure:**
- `assets/` - Bolt badge branding assets
- `docs/` - Implementation plan, development guide, cleanup guide
- `tools/` - TypeScript configuration base
- Configuration files: `package.json`, `eslint.config.js`, `devvit.yaml`

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