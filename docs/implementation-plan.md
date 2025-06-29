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

## Phase 2: Easy Mode Implementation
*🎮 **STARTS AFTER**: Phase 1 home screen is complete with "Coming Soon" placeholder*
*🎯 **GOAL**: Replace "Coming Soon" screen with actual playable Easy mode calculator game*

### 2.1 Game Types & Data Structures
- [ ] **Define game types** in `src/shared/types/game.ts`
  - [ ] `GameState` interface with current game status *(tracks if game is active, paused, won, lost)*
  - [ ] `MathProblem` interface for problem structure *(stores the equation like "_ + _ = 7")*
  - [ ] `ButtonMapping` interface for scrambled buttons *(maps what button "3" actually does when pressed)*
  - [ ] `CalculatorButton` interface for button representation *(defines each calculator button's properties)*
  - [ ] `GameDisplayState` interface for LCD display layout *(timer, equation, user input positioning)*

### 2.2 Calculator UI Foundation
- [ ] **Create `src/client/components/Calculator.tsx`**
  - [ ] **5x4 button layout**: 
    ```
    [⌫] [⌫] [⌫] [÷]
    [7] [8] [9] [×]
    [4] [5] [6] [-]
    [1] [2] [3] [+]
    [ ] [0] [ ] [=]
    ```
  - [ ] **Delete button spans 3 cells**, **0 button with empty neighbors**
  - [ ] **Empty cells are invisible/transparent** (part of calculator border styling)
  - [ ] **Static frontend display** - buttons show correct labels always
  - [ ] Mobile-optimized button sizing and spacing
  - [ ] Button press animations and feedback
  - [ ] **Vintage Casio aesthetic** matching home screen design
  - [ ] **Touch-friendly** button sizing for mobile devices

### 2.3 Easy Mode Game Logic
- [ ] **Create `src/client/utils/buttonScrambler.ts`**
  - [ ] `scrambleNumbers()` function (only numbers 0-9 mixed)
  - [ ] Keep operators (+, -, ×, ÷, =, ⌫) working normally
  - [ ] Generate consistent mapping for game session
  - [ ] **Backend scrambling only** - frontend buttons display normal labels

- [ ] **Create `src/client/utils/problemGenerator.ts`**
  - [ ] Generate single-digit addition problems (`_ + _ = 7`)
  - [ ] Generate single-digit subtraction problems (`_ - _ = 3`)
  - [ ] **Multiple valid solutions** supported (e.g., `3+4=7`, `5+2=7`, `6+1=7`)
  - [ ] **Simple problem generation** - no need to pre-calculate all solutions
  - [ ] **Smart validation** - calculate if user's equation is mathematically correct

- [ ] **Create `src/client/hooks/useCalculator.ts`**
  - [ ] Manage calculator display state
  - [ ] Handle button press logic with scrambled mappings
  - [ ] Implement delete functionality
  - [ ] Track user input sequence
  - [ ] **Validate equations on-the-fly** when user presses equals

### 2.4 Easy Mode Game Screen
- [ ] **Create `src/client/components/GameScreen.tsx`**
  - [ ] **Seamless transition** from navigation to calculator interface
  - [ ] **"GAME START" message** displays for **2 seconds exactly**
  - [ ] **Timer begins counting down from 2:00** after "GAME START" message
  - [ ] **Hide navigation buttons** during gameplay (▲▼ OK ◄ disappear)
  - [ ] Integrate Calculator component below LCD display
  - [ ] Handle game start/reset logic
  - [ ] **Smooth visual transition** from menu to calculator layout

- [ ] **Create `src/client/components/GameDisplay.tsx`**
  - [ ] **LCD display layout** for game mode:
    - [ ] **Timer**: Top-left corner (2:00 countdown)
    - [ ] **Equation**: Top-center (`_ + _ = 7`)
    - [ ] **User Input**: Bottom-right (like calculator display)
    - [ ] **Feedback Area**: Bottom-left corner (for "INCORRECT" messages)
  - [ ] **Real-time equation building**: Shows `3` → `3+` → `3+4` as user types
  - [ ] **Calculator-style result display**: Shows calculated result when `=` pressed
  - [ ] **Vintage calculator aesthetic** consistent with home screen
  - [ ] **Real-time updates** as user presses buttons

- [ ] **Create `src/client/hooks/useGameLogic.ts`**
  - [ ] Manage overall game state
  - [ ] Handle answer validation logic
  - [ ] Implement win condition checking
  - [ ] **2-minute timer** management and timeout handling
  - [ ] **Timer stops immediately** when correct answer is submitted
  - [ ] **Calculator-style equation evaluation** when `=` is pressed
  - [ ] **Wrong answer feedback flow**: Show result → Show "INCORRECT" in bottom-left → Clear on next keypress
  - [ ] **Victory condition flow**: Show result → Stop timer → Show victory screen (smooth transition)

### 2.5 Easy Mode Feedback System
- [ ] **Create `src/client/components/FeedbackDisplay.tsx`**
  - [ ] **Wrong answer feedback flow**:
    - [ ] **Step 1**: Show calculated result in bottom-right (like real calculator)
    - [ ] **Step 2**: Display "INCORRECT" message in **bottom-left corner**
    - [ ] **Step 3**: Message persists until **user presses any key**
    - [ ] **Step 4**: Clear message and allow continued gameplay
  - [ ] **Visual feedback** with vintage calculator styling
  - [ ] **Real calculator behavior** - authentic feel and timing
  - [ ] **No discovery log** - removed from scope per user request

### 2.6 Easy Mode Game End
- [ ] **Create `src/client/components/VictoryScreen.tsx`**
  - [ ] **Victory screen within LCD display** (seamless flow maintained)
  - [ ] **Calculator buttons remain visible** during victory screen
  - [ ] **Victory display flow**:
    - [ ] **Step 1**: Show correct calculated result in bottom-right
    - [ ] **Step 2**: Timer stops immediately
    - [ ] **Step 3**: Smooth transition to victory screen within LCD
  - [ ] **Win celebration** with vintage calculator aesthetic
  - [ ] Show final score (remaining seconds when timer stopped)
  - [ ] Display the solved equation
  - [ ] **Navigation options within LCD**: "Play Again" and "Back to Home" 
  - [ ] **Buttons disappear only when navigating back to home screen**
  - [ ] **Mode completion celebration** with retro effects

- [ ] **Create `src/client/components/GameOver.tsx`**
  - [ ] **Timeout screen** when 2 minutes expire
  - [ ] Show "TIME UP" message in vintage calculator style
  - [ ] Display the unsolved problem
  - [ ] "Try Again" and "Back to Home" buttons
  - [ ] **Consistent styling** with rest of calculator interface

### 2.7 Checkpoint: Easy Mode Complete
- [ ] **Test complete easy mode gameplay flow**
  - [ ] Menu navigation → Difficulty selection → **"GAME START" (2 seconds)** → **Timer starts (2:00)** → Calculator interface
  - [ ] **Seamless transition** from navigation to game mode
  - [ ] **Smooth visual flow**: Home screen → Game screen → Victory screen → Home screen
  - [ ] **Calculator-like experience**: Authentic equation building and result display
- [ ] **Verify button scrambling works correctly**
  - [ ] **Frontend buttons display normal labels** (1,2,3...)
  - [ ] **Backend properly scrambles** number inputs only
  - [ ] **Operators work normally** (+, -, ×, ÷, =, ⌫)
- [ ] **Confirm problem generation and validation**
  - [ ] **Single-digit addition/subtraction** problems generated
  - [ ] **Multiple valid solutions** accepted correctly
  - [ ] **Math validation** works properly on equals press
- [ ] **Test feedback system**
  - [ ] **Wrong answer flow**: Result displayed → "INCORRECT" in bottom-left → Clears on keypress
  - [ ] **Victory flow**: Result displayed → Timer stops → Victory screen within LCD
  - [ ] **Real calculator behavior**: Authentic timing and visual feedback
  - [ ] **No discovery log** (removed from scope)
- [ ] **Validate win/lose conditions**
  - [ ] **Correct answer flow**: Result shown → Timer stops immediately → Victory screen
  - [ ] **Timer expiration** triggers game over screen
  - [ ] **Proper score calculation** (remaining seconds when timer stopped)
  - [ ] **Victory screen within LCD** maintains seamless experience
  - [ ] **Calculator buttons remain visible** until returning to home screen
- [ ] **Test timer and timeout behavior**
  - [ ] **"GAME START" message** displays for exactly 2 seconds
  - [ ] **2-minute countdown** begins after "GAME START" message
  - [ ] **Timer stops immediately** when correct answer submitted
  - [ ] **LCD display layout** (timer top-left, equation top-center, input bottom-right, feedback bottom-left)
  - [ ] **Equation building display** shows real-time user input (`3` → `3+` → `3+4`)
  - [ ] **Calculator result display** shows calculated value when `=` pressed
  - [ ] **Timeout handling** shows appropriate game over screen

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