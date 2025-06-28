# BrokenCalc - Step-by-Step Implementation Plan

This document provides a detailed implementation roadmap for BrokenCalc, organized as a checklist with clear checkpoints for incremental development and testing.

## Phase 1: Foundation & Home Screen

### 1.1 Project Setup & Types
- [ ] **Define shared types** in `src/shared/types/game.ts`
  - [ ] `DifficultyMode` enum (`'easy' | 'medium' | 'hard' | 'hardcore' | 'godtier'`)
  - [ ] `GameState` interface with current game status
  - [ ] `MathProblem` interface for problem structure
  - [ ] `ButtonMapping` interface for scrambled buttons
  - [ ] `CalculatorButton` interface for button representation

### 1.2 Home Screen Implementation
- [ ] **Create `src/client/components/HomeScreen.tsx`**
  - [ ] Difficulty selection buttons (Easy, Medium, Hard, Hardcore, God Tier)
  - [ ] "How to Play" button/modal trigger
  - [ ] Reddit username welcome message
  - [ ] Arcade-style responsive design with Tailwind
  - [ ] Mobile-first 3x5 calculator preview

- [ ] **Create `src/client/components/HowToPlay.tsx`**
  - [ ] Modal component explaining game rules
  - [ ] Difficulty-specific explanations
  - [ ] Visual examples of button scrambling
  - [ ] Close/dismiss functionality

- [ ] **Update `src/client/App.tsx`**
  - [ ] Router setup for Home → Game screens
  - [ ] State management for current screen
  - [ ] Difficulty selection handler

### 1.3 Checkpoint: Home Screen Complete
- [ ] **Test home screen navigation**
- [ ] **Verify mobile responsiveness**
- [ ] **Confirm difficulty selection works**
- [ ] **Validate "How to Play" modal**

---

## Phase 2: Easy Mode Implementation

### 2.1 Calculator UI Foundation
- [ ] **Create `src/client/components/Calculator.tsx`**
  - [ ] 3x5 button layout: `[⌫][÷] [7][8][9][×] [4][5][6][-] [1][2][3][+] [0][][=]`
  - [ ] Mobile-optimized button sizing and spacing
  - [ ] Button press animations and feedback
  - [ ] Calculator display screen
  - [ ] Arcade-style visual design

### 2.2 Easy Mode Game Logic
- [ ] **Create `src/client/utils/buttonScrambler.ts`**
  - [ ] `scrambleNumbers()` function (only numbers 0-9 mixed)
  - [ ] Keep operators (+, -, ×, ÷, =, ⌫) working normally
  - [ ] Generate consistent mapping for game session

- [ ] **Create `src/client/utils/problemGenerator.ts`**
  - [ ] Generate single-digit addition problems (`_ + _ = 7`)
  - [ ] Generate single-digit subtraction problems (`_ - _ = 3`)
  - [ ] Ensure multiple possible solutions exist
  - [ ] Return problem with all valid solution combinations

- [ ] **Create `src/client/hooks/useCalculator.ts`**
  - [ ] Manage calculator display state
  - [ ] Handle button press logic with scrambled mappings
  - [ ] Implement delete functionality
  - [ ] Track user input sequence

### 2.3 Easy Mode Game Screen
- [ ] **Create `src/client/components/GameScreen.tsx`**
  - [ ] Display current math problem at top
  - [ ] Integrate Calculator component
  - [ ] Show current difficulty mode
  - [ ] Handle game start/reset logic

- [ ] **Create `src/client/components/Timer.tsx`**
  - [ ] 2-minute countdown display
  - [ ] Visual progress indicator
  - [ ] Time warning states (30s, 10s remaining)
  - [ ] Timeout handler trigger

- [ ] **Create `src/client/hooks/useGameLogic.ts`**
  - [ ] Manage overall game state
  - [ ] Handle answer validation logic
  - [ ] Implement win condition checking
  - [ ] Time management and timeout handling

### 2.4 Easy Mode Special Features
- [ ] **Create `src/client/components/DiscoveryLog.tsx`**
  - [ ] Modal showing discovered button mappings
  - [ ] Track which buttons have been pressed
  - [ ] Show "Button X actually does Y" entries
  - [ ] Toggle visibility button in game screen

### 2.5 Easy Mode Game End
- [ ] **Create `src/client/components/GameOver.tsx`**
  - [ ] Win/lose result display
  - [ ] Show final score (remaining seconds)
  - [ ] Display problem and user's solution
  - [ ] "Play Again" and "Back to Home" buttons
  - [ ] Mode completion celebration

### 2.6 Checkpoint: Easy Mode Complete
- [ ] **Test complete easy mode gameplay flow**
- [ ] **Verify button scrambling works correctly**
- [ ] **Confirm problem generation and validation**
- [ ] **Test discovery log functionality**
- [ ] **Validate win/lose conditions**
- [ ] **Test timer and timeout behavior**

---

## Phase 3: Server Integration & Persistence

### 3.1 Server API Foundation
- [ ] **Update `src/server/index.ts`**
  - [ ] Express.js route setup
  - [ ] CORS configuration for client communication
  - [ ] Error handling middleware

- [ ] **Create `src/server/api/game.ts`**
  - [ ] `POST /api/game/start` - Initialize new game session
  - [ ] `POST /api/game/submit-answer` - Validate user solution
  - [ ] `POST /api/game/end` - Complete game and calculate score
  - [ ] Redis integration for session storage

### 3.2 Client-Server Integration
- [ ] **Update game logic to use server APIs**
  - [ ] Fetch initial game data from server
  - [ ] Submit answers for server-side validation
  - [ ] Persist game state to handle page refreshes

### 3.3 Checkpoint: Server Integration Complete
- [ ] **Test client-server communication**
- [ ] **Verify game state persistence**
- [ ] **Confirm answer validation works**

---

## Phase 4: Medium Mode Implementation

### 4.1 Medium Mode Scrambling
- [ ] **Extend `buttonScrambler.ts`**
  - [ ] `scrambleOperators()` function (operators mixed among themselves)
  - [ ] `generateMediumMapping()` combining number and operator scrambling
  - [ ] Keep delete button working normally

### 4.2 Medium Mode Problems
- [ ] **Extend `problemGenerator.ts`**
  - [ ] Add multiplication problems (`_ × _ = 12`)
  - [ ] Add division problems (`_ ÷ _ = 3`)
  - [ ] Ensure all four operators are used
  - [ ] Maintain single-digit operands

### 4.3 Medium Mode Features
- [ ] **Remove discovery log for medium mode**
- [ ] **Update game screen to show difficulty-specific UI**
- [ ] **Add medium mode completion tracking**

### 4.4 Checkpoint: Medium Mode Complete
- [ ] **Test medium mode scrambling behavior**
- [ ] **Verify all four operators work correctly**
- [ ] **Confirm increased difficulty is apparent**

---

## Phase 5: Hard Mode Implementation

### 5.1 Hard Mode Scrambling
- [ ] **Extend `buttonScrambler.ts`**
  - [ ] `scrambleNumbersAndOperators()` - mix numbers and operators together
  - [ ] Handle edge cases where number might map to operator
  - [ ] Maintain delete button functionality

### 5.2 Hard Mode Problems
- [ ] **Extend `problemGenerator.ts`**
  - [ ] Two-digit addition (`_ _ + _ _ = 35`)
  - [ ] Two-digit multiplication (`_ _ × _ = 42`)
  - [ ] More complex problem combinations
  - [ ] Ensure multiple valid solutions exist

### 5.3 Checkpoint: Hard Mode Complete
- [ ] **Test number-operator mixing**
- [ ] **Verify two-digit problem generation**
- [ ] **Confirm difficulty escalation**

---

## Phase 6: Hardcore Mode Implementation

### 6.1 Hardcore Mode Scrambling
- [ ] **Extend `buttonScrambler.ts`**
  - [ ] `scrambleEverything()` - including equals button
  - [ ] Only delete button remains normal
  - [ ] Maximum chaos while keeping game winnable

### 6.2 Hardcore Mode Problems
- [ ] **Most challenging single/two-digit combinations**
- [ ] **Complex multi-operator possibilities**

### 6.3 Checkpoint: Hardcore Mode Complete
- [ ] **Test maximum scrambling difficulty**
- [ ] **Verify game remains winnable**
- [ ] **Confirm all buttons except delete are scrambled**

---

## Phase 7: Polish & User Experience

### 7.1 Silly Timeout Messages
- [ ] **Create timeout message collection**
  - [ ] Hilarious calculator "surrender" quotes
  - [ ] Difficulty-specific timeout messages
  - [ ] Random selection system

### 7.2 Visual Polish
- [ ] **Enhance button animations**
- [ ] **Add victory celebration effects**
- [ ] **Implement arcade-style transitions**
- [ ] **Add loading states**

### 7.3 Mobile Optimization
- [ ] **Test on various mobile screen sizes**
- [ ] **Optimize touch targets**
- [ ] **Ensure smooth performance**
- [ ] **Add haptic feedback (if supported)**

### 7.4 Checkpoint: Polish Complete
- [ ] **Test complete user experience flow**
- [ ] **Verify mobile optimization**
- [ ] **Confirm all animations work smoothly**

---

## Phase 8: Scoring & Leaderboards (Optional)

### 8.1 Scoring System
- [ ] **Create `src/client/utils/scoring.ts`**
  - [ ] Time-based scoring (remaining seconds = points)
  - [ ] Difficulty multipliers
  - [ ] Score calculation and display

### 8.2 Server-Side Scoring
- [ ] **Create `src/server/api/scores.ts`**
  - [ ] `POST /api/scores/submit` - Save user scores
  - [ ] `GET /api/scores/leaderboard` - Retrieve top scores
  - [ ] `GET /api/scores/personal` - User's personal bests

### 8.3 Leaderboard UI
- [ ] **Create `src/client/components/Leaderboard.tsx`**
  - [ ] Display top scores by difficulty
  - [ ] Show personal bests
  - [ ] Filter by time periods

### 8.4 Checkpoint: Scoring Complete
- [ ] **Test score submission and retrieval**
- [ ] **Verify leaderboard functionality**
- [ ] **Confirm personal best tracking**

---

## Phase 9: God Tier Mode (Easter Egg)

### 9.1 God Tier Implementation
- [ ] **Extend `buttonScrambler.ts`**
  - [ ] `scrambleEverythingIncludingDisplay()` - buttons lie about what they show
  - [ ] Press 1, shows 2, actually inputs 7
  - [ ] Maximum confusion mode

### 9.2 God Tier Problem
- [ ] **Single "impossible" problem**
- [ ] **Easter egg discovery mechanics**
- [ ] **Special victory message**

### 9.3 Checkpoint: God Tier Complete
- [ ] **Test ultimate difficulty mode**
- [ ] **Verify display lying mechanics**
- [ ] **Confirm it's hilariously difficult but winnable**

---

## Phase 10: Devvit Integration

### 10.1 Reddit Post Integration
- [ ] **Update `src/devvit/main.tsx`**
  - [ ] Create post button in Reddit interface
  - [ ] Handle webview launch
  - [ ] Pass Reddit context (username, etc.)

### 10.2 Reddit-Specific Features
- [ ] **Username integration in webview**
- [ ] **Community features (if applicable)**
- [ ] **Shareable results formatting**

### 10.3 Checkpoint: Devvit Integration Complete
- [ ] **Test post creation in Reddit**
- [ ] **Verify webview functionality**
- [ ] **Confirm username passing works**

---

## Final Testing & Deployment

### Pre-Deployment Checklist
- [ ] **Complete gameplay flow test for all modes**
- [ ] **Mobile responsiveness verification**
- [ ] **Server API stability testing**
- [ ] **Performance optimization check**
- [ ] **Error handling validation**

### Deployment Steps
- [ ] **Build client application**
- [ ] **Deploy server endpoints**
- [ ] **Upload to Reddit via Devvit CLI**
- [ ] **Test in production subreddit**

### Post-Deployment Validation
- [ ] **Verify all features work in Reddit environment**
- [ ] **Test with multiple users**
- [ ] **Monitor for any production issues**
- [ ] **Gather user feedback**

---

## Success Metrics

### Technical Metrics
- [ ] All difficulty modes functional
- [ ] Mobile optimization complete
- [ ] Server integration stable
- [ ] Reddit integration working

### User Experience Metrics
- [ ] Intuitive home screen navigation
- [ ] Clear difficulty progression
- [ ] Satisfying button discovery mechanics
- [ ] Hilarious timeout experiences
- [ ] Engaging victory celebrations

### Reddit Integration Metrics
- [ ] Successful post creation
- [ ] Smooth webview experience
- [ ] Community engagement features
- [ ] Shareable moments creation

---

*This implementation plan prioritizes core functionality first, then progressively adds complexity and polish. Each checkpoint ensures stability before moving to the next phase.* 