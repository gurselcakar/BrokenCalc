# BrokenCalc - Step-by-Step Implementation Plan

This document provides a detailed implementation roadmap for BrokenCalc, organized as a checklist with clear checkpoints for incremental development and testing.

## Phase 1: Foundation & Vintage Calculator Home Screen

### 1.1 Home Screen Types Setup
- [x] **Define home screen types** in `src/shared/types/navigation.ts`
  - [x] `DifficultyMode` enum (`'easy' | 'medium' | 'hard' | 'hardcore' | 'godtier'`) - *for difficulty selection only*
  - [x] `MenuOption` type for home screen navigation (`'PLAY' | 'HOW TO PLAY' | 'LEADERBOARD'`)
  - [x] `ScreenState` type (`'WELCOME' | 'MAIN_MENU' | 'DIFFICULTY_SELECTION' | 'COMING_SOON' | 'HOW_TO_PLAY' | 'LEADERBOARD'`)
  - [x] `InputMethod` type (`'TOUCH' | 'MOUSE' | 'KEYBOARD'`) - *for detecting input type*
  - [x] `NavigationAction` type (`'UP' | 'DOWN' | 'SELECT' | 'BACK'`) - *for unified navigation actions*
  - [x] `HomeScreenState` interface for menu navigation state and welcome sequence *(enhanced with scroll support)*
  - [x] `WelcomeState` interface for username display and transition timing
  - [x] `NavigationState` interface for tracking current screen, selected option, and navigation history

### 1.2 Vintage Calculator Display Home Screen
- [x] **Create `src/client/components/HomeScreen.tsx`**
  - [x] Full-screen Casio-style calculator display design (green-on-black LCD aesthetic)
  - [x] **Real CASIO fx-85GT X CLASSWIZ branding** *(design decision: used authentic branding)*
  - [x] Thick calculator display bezels **with detailed solar panel area** *(enhanced from original plan)*
  - [x] Dark background with monospace font for display text
  - [x] Classic green text color on dark display background
  - [x] Mobile-responsive design maintaining calculator display proportions
  - [x] Touch-friendly interface while preserving vintage aesthetic

- [x] **Create `src/client/components/CalculatorDisplay.tsx`**
  - [x] Vintage LCD display component with thick realistic borders
  - [x] Scanline effects and subtle green glow for authenticity
  - [x] Text rendering with classic calculator dot-matrix font
  - [x] Responsive sizing while maintaining aspect ratio
  - [x] Display dimming/brightening animations
  - [x] Retro refresh effect for menu transitions (like old calculator screen updates)
  - [x] **Detailed solar panel with individual solar cells** *(enhancement)*

- [x] **Create `src/client/components/WelcomeSequence.tsx`**
  - [x] Initial welcome message display: "WELCOME [USERNAME]"
  - [x] Smooth transition from welcome to menu after 2-3 seconds
  - [x] Authentic calculator startup sequence feel
  - [x] Reddit username integration with proper formatting

- [x] **Create `src/client/components/MenuNavigation.tsx`**
  - [x] **Four-button navigation panel** positioned on right inside display
  - [x] Up arrow (▲), OK button, Down arrow (▼), **Back button (◄)** with vintage Casio-style styling
  - [x] Menu cycling logic: >PLAY → >HOW TO PLAY → >LEADERBOARD → >PLAY
  - [x] Single menu item display with ">" prefix (e.g., ">PLAY")
  - [x] **Multi-platform navigation support:**
    - [x] **Mobile**: Touch/tap buttons (▲▼ to navigate, OK to select, ◄ to go back)
    - [x] **Desktop Mouse**: Click buttons (same as mobile)
    - [x] **Desktop Keyboard**: Up/Down arrows (navigate), Enter/Right arrow (select), Left arrow (back)
  - [x] Retro refresh effect between menu transitions
  - [x] Authentic calculator button press animations with depression and feedback
  - [x] Touch-friendly button sizes while maintaining vintage appearance
  - [x] **Back button visibility**: Show/hide based on current screen (hidden on main menu, visible on sub-menus)

- [x] **Create `src/client/components/DifficultySelection.tsx`**
  - [x] Difficulty selection screen triggered after "PLAY" selection
  - [x] Menu options: >EASY → >MEDIUM → >HARD → >HARDCORE → >GOD TIER → >EASY
  - [x] Same navigation pattern as main menu with all input methods
  - [x] Retro transition effects between difficulty options
  - [x] **Back button functionality**: Return to main menu (Left arrow key, Back button, or Escape key)
  - [x] **On difficulty selection (OK press), navigate to "Coming Soon" placeholder**

- [x] **Create `src/client/components/ComingSoon.tsx`**
  - [x] Temporary placeholder screen for game functionality
  - [x] Vintage calculator display styling consistent with home screen
  - [x] Message: "COMING SOON..." in retro calculator font
  - [x] Show selected difficulty mode (e.g., "EASY MODE")
  - [x] **Multiple return options**:
    - [x] **Mobile**: Back button (◄) or tap anywhere on screen
    - [x] **Desktop**: Left arrow, Escape key, or Back button click
    - [x] Display "Press ◄ to return" instruction
  - [x] Maintains vintage aesthetic while clearly indicating placeholder status

- [x] **Create `src/client/hooks/useMenuNavigation.ts`**
  - [x] Menu state management (current selected option)
  - [x] **Comprehensive input handling:**
    - [x] **Keyboard events**: Up/Down (navigate), Enter/Right (select), Left/Escape (back)
    - [x] **Touch events**: Button taps and screen interactions
    - [x] **Mouse events**: Button clicks and hover states
  - [x] Circular navigation logic between menu options
  - [x] Menu selection action handlers
  - [x] **Back navigation logic** with screen history stack
  - [x] Retro refresh effect triggering
  - [x] Navigation between main menu, difficulty selection, and sub-screens
  - [x] **Navigation button visibility control** (show/hide back button based on current screen)
  - [x] **Enhanced with scrollable content support** *(for longer pages)*

- [x] **Create `src/client/components/HowToPlay.tsx`**
  - [x] Full-screen overlay maintaining calculator display aesthetic
  - [x] Game rules displayed in vintage calculator style
  - [x] Difficulty-specific explanations with retro formatting
  - [x] **Navigation instructions for all input methods** (touch, mouse, keyboard)
  - [x] **Back navigation functionality** using same multi-platform approach
  - [x] Return to main menu via ◄ button, Left arrow, or Escape key
  - [x] **Enhanced with scrollable content** *(for longer rule explanations)*

- [x] **Create `src/client/components/Leaderboard.tsx`**
  - [x] Scoreboard displayed in calculator display style
  - [x] Top scores with vintage formatting and monospace alignment
  - [x] Difficulty-based filtering with calculator-style selection
  - [x] **Back navigation functionality** using same multi-platform approach
  - [x] Return to main menu via ◄ button, Left arrow, or Escape key
  - [x] **Enhanced with scrollable content and sample data** *(for longer leaderboards)*

- [x] **Update `src/client/App.tsx`**
  - [x] Router setup for Home → Difficulty Selection → Coming Soon → Leaderboard screens
  - [x] State management for current screen, menu selection, and difficulty
  - [x] Menu option handlers (Play → Difficulty → Coming Soon, How to Play, Leaderboard)
  - [x] Reddit username integration for welcome sequence
  - [x] Welcome sequence initialization on app start
  - [x] **Temporary routing: difficulty selection leads to "Coming Soon" placeholder**

- [x] **Create `src/client/components/ScrollableContent.tsx`** *(ENHANCEMENT ADDED)*
  - [x] **Reusable scrollable content wrapper for longer pages**
  - [x] **Smooth scroll behavior with vintage calculator aesthetic**
  - [x] **Scroll bounds calculation and management**
  - [x] **Integration with navigation controls for scroll vs menu navigation**

### 1.3 Vintage Casio-Style Styling & Assets
- [x] **Create `src/client/styles/vintage-calculator.css`**
  - [x] CSS custom properties for green-on-black LCD color scheme
  - [x] Thick calculator display border and bezel styles (Casio-inspired)
  - [x] **Real CASIO branding styling** *(design decision: authentic branding)*
  - [x] Dot-matrix monospace font imports and fallbacks
  - [x] Retro refresh effect animation keyframes
  - [x] Scanline and green glow effects
  - [x] Mobile-responsive vintage styling with touch-friendly elements
  - [x] Authentic calculator button depression animations
  - [x] **Enhanced mobile responsiveness across multiple screen sizes** *(improvement)*
  - [x] **Scrollable content styling for longer pages** *(enhancement)*

- [x] **Create vintage visual assets**
  - [x] Casio-style calculator display background and bezels
  - [x] Navigation button styling with authentic calculator button appearance
  - [x] Green LCD glow and scanline overlay effects
  - [x] Retro refresh transition effects
  - [x] Touch-friendly button press state indicators
  - [x] **Detailed solar panel visual design** *(enhancement)*

### 1.4 Navigation Testing *(READY FOR USER TESTING)*
- [x] **Implement comprehensive input methods across all screens:**
  - [x] **Mobile Touch Navigation**: Tap ▲▼ to navigate, OK to select, ◄ to go back
  - [x] **Desktop Mouse Navigation**: Click all buttons, hover effects work
  - [x] **Desktop Keyboard Navigation**: 
    - [x] Up/Down arrows navigate options
    - [x] Enter OR Right arrow selects/confirms
    - [x] Left arrow OR Escape goes back
    - [x] All keyboard shortcuts work from any screen

- [x] **Implement back navigation flow:**
  - [x] Main Menu → Difficulty Selection → Back to Main Menu
  - [x] Main Menu → How to Play → Back to Main Menu  
  - [x] Main Menu → Leaderboard → Back to Main Menu
  - [x] Difficulty Selection → Coming Soon → Back to Main Menu
  - [x] Back button shows/hides appropriately on each screen

- [x] **Implement navigation button visibility:**
  - [x] Main menu: ▲▼ and OK visible, ◄ hidden
  - [x] Sub-screens: ▲▼, OK, and ◄ all visible
  - [x] Coming Soon: Only ◄ visible (or tap to return)
  - [x] **Enhanced with scroll vs menu navigation logic** *(for scrollable content)*

### 1.5 Checkpoint: Vintage Calculator Home Screen Complete ✅
*🎯 **GOAL**: Complete home screen UI/UX with placeholder for game functionality*
*📋 **STATUS**: No actual game mechanics - difficulty selection leads to "Coming Soon" screen*

- [x] **Test welcome sequence with Reddit username display**
- [x] **Verify green-on-black LCD calculator display aesthetic**
- [x] **Confirm circular menu navigation (>PLAY → >HOW TO PLAY → >LEADERBOARD → >PLAY)**
- [x] **Test complete difficulty selection flow (PLAY → select difficulty → "COMING SOON" screen)**
- [x] **Verify "Coming Soon" placeholder displays selected difficulty and returns to menu**
- [x] **Validate retro refresh effects between menu transitions**
- [x] **Test authentic calculator button press animations**
- [x] **Validate mobile responsiveness while maintaining vintage aesthetic**
- [x] **Test "How to Play" and "Leaderboard" screens in calculator style**
- [x] **Verify authentic CASIO styling** *(with real branding instead of fake)*
- [x] **Confirm scanline and green glow effects work properly**
- [x] **Enhanced scrollable content for longer pages** *(improvement)*

**✅ PHASE 1 COMPLETE**: User can navigate entire home screen experience, select difficulty, see "Coming Soon" message, and return to menu - all with perfect vintage calculator aesthetic! 

**🎉 ENHANCEMENTS DELIVERED:**
- Real CASIO fx-85GT X CLASSWIZ authentic branding
- Detailed solar panel with individual cells
- Scrollable content support for How to Play and Leaderboard
- Enhanced mobile responsiveness across all screen sizes
- Advanced scroll vs menu navigation logic

---

## 📋 CURRENT IMPLEMENTATION STATUS SUMMARY

### ✅ **COMPLETED:**
- **Phase 1**: Complete home screen navigation with vintage calculator aesthetic
- **Game Architecture**: All difficulty modes (Easy→God Tier) implemented with button scrambling and problem generation
- **Core Game Flow**: Game start, timer, equation building, answer validation logic
- **Calculator UI**: Full 5x4 button layout with proper styling and mobile optimization

### 🔄 **PARTIALLY COMPLETE:**
- **Phase 2**: Game mechanics work but missing critical user feedback features

### ❌ **MISSING (HIGH PRIORITY):**
- **Calculator result display** when `=` pressed
- **"INCORRECT" feedback** for wrong answers  
- **Victory screen** when player wins
- **Game over screen** when timer expires
- **Play Again / Back to Home** navigation from end screens

---

## Phase 2: Game Implementation *(Originally "Easy Mode" - Expanded to All Modes)*
*🎮 **STARTS AFTER**: Phase 1 home screen is complete with "Coming Soon" placeholder*
*🎯 **GOAL**: Replace "Coming Soon" screen with actual playable Easy mode calculator game*

### 2.1 Game Types & Data Structures
- [x] **Define game types** in `src/shared/types/game.ts` *(DONE & ENHANCED)*
  - [x] `GameState` interface with current game status *(ENHANCED: includes 'starting' | 'playing' | 'won' | 'timeup')*
  - [x] `MathProblem` interface for problem structure *(DONE with possibleSolutions[] array)*
  - [x] `ButtonMapping` interface for scrambled buttons *(ENHANCED: includes optional display mapping for God Tier)*
  - [x] `CalculatorButton` interface for button representation *(ENHANCED: includes gridPosition for layout)*
  - [x] `GameDisplayState` interface for LCD display layout *(DONE: complete LCD layout management)*
  - [x] **🚀 ENHANCEMENT**: All difficulty modes supported upfront (Easy through God Tier)

### 2.2 Calculator UI Foundation
- [x] **Create `src/client/components/Calculator.tsx`** *(COMPLETED)*
  - [x] **5x4 button layout**: ✅ Exact layout as specified
    ```
    [⌫] [⌫] [⌫] [÷]
    [7] [8] [9] [×]
    [4] [5] [6] [-]
    [1] [2] [3] [+]
    [ ] [0] [ ] [=]
    ```
  - [x] **Delete button spans 3 cells**, **0 button with empty neighbors** ✅
  - [x] **Empty cells are invisible/transparent** ✅
  - [x] **Static frontend display** - buttons show correct labels always ✅
  - [x] Mobile-optimized button sizing and spacing ✅
  - [x] Button press animations and feedback ✅
  - [x] **Vintage Casio aesthetic** matching home screen design ✅
  - [x] **Touch-friendly** button sizing for mobile devices ✅

### 2.3 Game Logic *(DRAMATICALLY EXPANDED - ALL MODES IMPLEMENTED)*
- [x] **Create `src/client/utils/buttonScrambler.ts`** *(DONE FOR ALL DIFFICULTY MODES)*
  - [x] `scrambleNumbers()` function for Easy mode ✅
  - [x] `scrambleOperators()` function for Medium mode ✅
  - [x] `scrambleNumbersAndOperators()` for Hard mode ✅
  - [x] `scrambleEverything()` for Hardcore mode ✅
  - [x] `scrambleEverythingIncludingDisplay()` for God Tier mode ✅
  - [x] **Backend scrambling only** - frontend buttons display normal labels ✅
  - [x] **🚀 ENHANCEMENT**: Complete implementation for Phases 2-9 difficulty modes

- [x] **Create `src/client/utils/problemGenerator.ts`** *(DONE FOR ALL DIFFICULTY MODES)*
  - [x] Generate single-digit addition/subtraction problems (Easy) ✅
  - [x] Generate all four operators problems (Medium) ✅
  - [x] Generate two-digit problems (Hard) ✅
  - [x] Generate complex combinations (Hardcore) ✅
  - [x] Generate "impossible" God Tier problems ✅
  - [x] **Multiple valid solutions** supported with `possibleSolutions[]` array ✅
  - [x] **Smart validation** with `validateEquation()` function ✅
  - [x] **🚀 ENHANCEMENT**: Complete implementation for all planned difficulty modes

- [x] **Create `src/client/hooks/useCalculator.ts`** *(COMPLETED)*
  - [x] Manage calculator display state ✅
  - [x] Handle button press logic with scrambled mappings ✅
  - [x] Implement delete functionality ✅
  - [x] Track user input sequence ✅
  - [x] **❌ MISSING**: Equation result display when `=` pressed (no calculation shown)

### 2.4 Game Screen Integration *(ARCHITECTURAL CHANGE - INTEGRATED APPROACH)*
- [ ] **Create `src/client/components/GameScreen.tsx`** *(❌ NOT CREATED)*
  - [x] **🔄 ACTUAL IMPLEMENTATION**: Game integrated directly into `HomeScreen.tsx`
  - [x] **Seamless transition** from navigation to calculator interface ✅
  - [x] **"GAME START" message** displays for **2 seconds exactly** ✅
  - [x] **Timer begins counting down from 2:00** after "GAME START" message ✅
  - [x] **Hide navigation buttons** during gameplay ✅
  - [x] Calculator component integration ✅
  - [x] Handle game start/reset logic ✅
  - [x] **Smooth visual transition** from menu to calculator layout ✅

- [x] **Create `src/client/components/GameDisplay.tsx`** *(COMPLETED)*
  - [x] **LCD display layout** for game mode: ✅
    - [x] **Timer**: Top-left corner (2:00 countdown) ✅
    - [x] **Equation**: Top-center (`_ + _ = 7`) ✅
    - [x] **User Input**: Bottom-right (shows equation building) ✅
    - [x] **Feedback Area**: Bottom-left corner ✅
  - [x] **Real-time equation building**: Shows `3` → `3+` → `3+4` as user types ✅
  - [x] **❌ MISSING**: Calculator result display when `=` pressed (no calculation shown)
  - [x] **Vintage calculator aesthetic** consistent with home screen ✅
  - [x] **Real-time updates** as user presses buttons ✅

- [x] **Create `src/client/hooks/useGameLogic.ts`** *(COMPLETED)*
  - [x] Manage overall game state ✅
  - [x] Handle answer validation logic ✅
  - [x] Implement win condition checking ✅
  - [x] **2-minute timer** management and timeout handling ✅
  - [x] **Timer stops immediately** when correct answer is submitted ✅
  - [x] **❌ MISSING**: Calculator result display when `=` pressed
  - [x] **❌ MISSING**: Wrong answer feedback flow (no "INCORRECT" display)
  - [x] **❌ MISSING**: Victory condition flow (no victory screen shown)

### 2.5 Feedback System *(❌ NOT IMPLEMENTED - MISSING CRITICAL FEATURE)*
- [ ] **Create `src/client/components/FeedbackDisplay.tsx`** *(❌ NOT CREATED)*
  - [ ] **❌ MISSING**: Wrong answer feedback flow
    - [ ] **❌ MISSING**: Show calculated result in bottom-right (calculator doesn't show result on `=` press)
    - [ ] **❌ MISSING**: Display "INCORRECT" message in bottom-left corner  
    - [ ] **❌ MISSING**: Message persistence until user presses any key
    - [ ] **❌ MISSING**: Clear message and allow continued gameplay
  - [ ] **❌ MISSING**: Visual feedback with vintage calculator styling
  - [ ] **❌ MISSING**: Real calculator behavior and timing
  - [x] **No discovery log** - correctly removed from scope ✅

### 2.6 Game End Screens *(❌ NOT IMPLEMENTED - MISSING CRITICAL FEATURES)*
- [ ] **Create `src/client/components/VictoryScreen.tsx`** *(❌ NOT CREATED)*
  - [ ] **❌ MISSING**: Victory screen within LCD display
  - [ ] **❌ MISSING**: Calculator buttons remain visible during victory screen
  - [ ] **❌ MISSING**: Victory display flow
    - [ ] **❌ MISSING**: Show correct calculated result in bottom-right
    - [ ] **❌ MISSING**: Timer stops immediately (logic exists but no visual feedback)
    - [ ] **❌ MISSING**: Smooth transition to victory screen within LCD
  - [ ] **❌ MISSING**: Win celebration with vintage calculator aesthetic
  - [ ] **❌ MISSING**: Show final score (remaining seconds when timer stopped)
  - [ ] **❌ MISSING**: Display the solved equation
  - [ ] **❌ MISSING**: Navigation options within LCD ("Play Again" and "Back to Home")
  - [ ] **❌ MISSING**: Mode completion celebration with retro effects

- [ ] **Create `src/client/components/GameOver.tsx`** *(❌ NOT CREATED)*
  - [ ] **❌ MISSING**: Timeout screen when 2 minutes expire
  - [ ] **❌ MISSING**: Show "TIME UP" message in vintage calculator style
  - [ ] **❌ MISSING**: Display the unsolved problem
  - [ ] **❌ MISSING**: "Try Again" and "Back to Home" buttons
  - [ ] **❌ MISSING**: Consistent styling with rest of calculator interface

### 2.7 Checkpoint: Game Implementation Status *(PARTIAL COMPLETION - MISSING CRITICAL FEATURES)*

#### ✅ **COMPLETED FEATURES:**
- [x] **Core game architecture and flow**
  - [x] Menu navigation → Difficulty selection → **"GAME START" (2 seconds)** → **Timer starts (2:00)** → Calculator interface ✅
  - [x] **Seamless transition** from navigation to game mode ✅
  - [x] **❌ MISSING**: Victory screen and game over screen (stops at result validation)
  - [x] **Partial**: Equation building display works, but missing result display
- [x] **Button scrambling system** *(ENHANCED - ALL MODES)*
  - [x] **Frontend buttons display normal labels** (1,2,3...) ✅
  - [x] **Backend properly scrambles** for ALL difficulty modes (Easy through God Tier) ✅
  - [x] **Operators scrambling** works for all relevant modes ✅
- [x] **Problem generation system** *(ENHANCED - ALL MODES)*
  - [x] **All difficulty modes** implemented (Easy through God Tier) ✅
  - [x] **Multiple valid solutions** supported with `possibleSolutions[]` array ✅
  - [x] **Math validation** works with `validateEquation()` function ✅
- [x] **Timer and basic game logic**
  - [x] **"GAME START" message** displays for exactly 2 seconds ✅
  - [x] **2-minute countdown** begins after "GAME START" message ✅
  - [x] **Timer logic** stops when correct answer submitted ✅
  - [x] **LCD display layout** (timer top-left, equation top-center, input bottom-right, feedback bottom-left) ✅
  - [x] **Equation building display** shows real-time user input (`3` → `3+` → `3+4`) ✅

#### ❌ **CRITICAL MISSING FEATURES:**
- [ ] **❌ CALCULATOR RESULT DISPLAY**: When user presses `=`, no calculation result is shown
- [ ] **❌ FEEDBACK SYSTEM**: No "INCORRECT" message displayed for wrong answers
- [ ] **❌ VICTORY SCREEN**: No visual feedback when player wins (timer stops but no celebration)
- [ ] **❌ GAME OVER SCREEN**: No timeout screen when 2 minutes expire
- [ ] **❌ WIN/LOSE FLOW**: Game logic works but no visual win/lose states shown to user

#### 🎯 **IMMEDIATE PRIORITIES TO COMPLETE PHASE 2:**
1. **Fix calculator result display** - Show calculated value when `=` pressed
2. **Implement feedback display** - Show "INCORRECT" message for wrong answers
3. **Create victory screen** - Show win celebration within LCD display
4. **Create game over screen** - Show "TIME UP" message on timeout
5. **Add navigation from win/lose screens** - "Play Again" and "Back to Home" options

**🔄 PHASE 2 STATUS: PARTIALLY COMPLETE** - Core architecture and game logic implemented for all difficulty modes, but missing critical user feedback features (result display, win/lose screens, feedback messages).

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