# BrokenCalc

A quirky calculator game for Reddit where the calculator is "broken" in interesting ways, creating challenges and entertainment for users. Built with Devvit for seamless Reddit integration.

![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Devvit](https://img.shields.io/badge/Devvit-FF4500?logo=reddit&logoColor=white)

## 🎮 Game Concept

BrokenCalc features a vintage Casio-style calculator where buttons are randomly scrambled based on difficulty. Players must solve math problems by discovering which buttons actually do what through trial and experimentation!

### Core Gameplay
- **The "Break"**: Calculator buttons are randomly remapped at game start
- **Discovery Mechanic**: Players figure out button mappings through trial
- **Time Pressure**: 2 minutes to solve each problem
- **Victory Condition**: Press `=` with the correct answer to win

### Difficulty Modes

| Mode | Scrambling Rules | Problem Types |
|------|-----------------|---------------|
| **Easy** | Only numbers (0-9) scrambled | Single-digit addition/subtraction |
| **Medium** | Numbers + operators scrambled separately | All four operations with single digits |
| **Hard** | Numbers and operators mixed together | Two-digit operations |
| **Hardcore** | Everything scrambled (including equals) | Most challenging combinations |
| **God Tier** | Even the display lies! | Single "impossible" challenge |

## 🏗️ Architecture

BrokenCalc follows Devvit's modular architecture:

```
src/
├── devvit/          # Reddit integration (Devvit components)
├── client/          # React webview (main game interface)
├── server/          # Node.js backend (game logic & data)
└── shared/          # Common types and utilities
```

### Component Breakdown

- **Devvit App** (`/src/devvit`): Handles Reddit post creation and platform integration
- **Client Webview** (`/src/client`): Full-screen React game interface with vintage calculator UI
- **Server** (`/src/server`): Serverless backend managing game logic and Redis data persistence
- **Shared** (`/src/shared`): TypeScript types and utilities shared across components

## ✨ Features

### 🎨 Vintage Calculator Aesthetic
- Authentic **Casio fx-85GT X CLASSWIZ** design with real branding
- Green-on-black LCD display with scanlines and glow effects
- Detailed solar panel with individual cells
- Retro refresh animations and button press feedback

### 🎯 Multi-Platform Navigation
- **Mobile**: Touch-friendly buttons (▲▼ to navigate, OK to select, ◄ to go back)
- **Desktop Mouse**: Click interface with hover effects
- **Desktop Keyboard**: Arrow keys (navigate), Enter/Right (select), Left/Escape (back)

### 🎮 Game Features
- Timer-based gameplay (2 minutes per problem)
- Real-time equation building display
- Multiple solution validation
- Seamless game flow within LCD interface
- Scrollable content for instructions and leaderboards

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Reddit account with test subreddit access
- Devvit CLI (included in dependencies)

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd BrokenCalc
   npm install
   ```

2. **Authenticate with Reddit**:
   ```bash
   npm run login
   ```

3. **Initialize Devvit app**:
   ```bash
   npm run devvit:init
   ```

4. **Update your test subreddit**:
   Edit `package.json` and replace `BrokenCalc` in the `dev:devvit` script with your test subreddit name.

### Development

Start all development servers:
```bash
npm run dev:all
```

This runs:
- **Vite dev server** (React client): `http://localhost:7474`
- **Devvit playtest**: Your Reddit test subreddit
- **Client build watcher**: Automatic builds for Devvit

### Testing Your App

1. Navigate to your test subreddit on Reddit
2. Click the three dots menu → "BrokenCalc: New Post"
3. Create a post to test your app with full functionality

## 📁 Project Structure

```
BrokenCalc/
├── src/
│   ├── client/                 # React webview application
│   │   ├── components/         # UI components
│   │   │   ├── Calculator.tsx  # 5x4 calculator grid
│   │   │   ├── CalculatorDisplay.tsx  # Vintage LCD display
│   │   │   ├── GameDisplay.tsx # Game interface layout
│   │   │   ├── HomeScreen.tsx  # Main menu navigation
│   │   │   └── ...
│   │   ├── hooks/              # React hooks
│   │   │   ├── useCalculator.ts    # Calculator logic
│   │   │   ├── useGameLogic.ts     # Game state management
│   │   │   └── useMenuNavigation.ts # Menu navigation
│   │   ├── utils/              # Utility functions
│   │   │   ├── buttonScrambler.ts  # Button mapping logic
│   │   │   └── problemGenerator.ts # Math problem creation
│   │   └── styles/
│   │       └── vintage-calculator.css # Authentic Casio styling
│   ├── devvit/
│   │   └── main.tsx           # Devvit app entry point
│   ├── server/
│   │   └── index.ts           # Express server with game APIs
│   └── shared/
│       └── types/             # Shared TypeScript types
│           ├── game.ts        # Game state and problem types
│           └── navigation.ts  # Menu and navigation types
├── docs/                      # Comprehensive documentation
└── assets/                    # Game assets and images
```

## 🛠️ Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:all` | Start all development servers |
| `npm run dev:vite` | Start Vite dev server only |
| `npm run dev:devvit` | Start Devvit playtest only |
| `npm run build:client` | Build client for production |
| `npm run deploy` | Build and deploy to Reddit |
| `npm run type-check` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run prettier` | Format code with Prettier |

## 🎯 Development Status

### ✅ Phase 1: Complete
- Vintage calculator home screen with authentic Casio aesthetic
- Multi-platform navigation (touch, mouse, keyboard)
- Welcome sequence with Reddit username integration
- Difficulty selection with vintage styling
- How to Play and Leaderboard screens with scrollable content

### 🚧 Phase 2: In Progress
- Easy mode implementation with button scrambling
- Calculator interface with 5x4 grid layout
- Math problem generation and validation
- Timer system and game flow

### 📋 Future Phases
- Medium through God Tier difficulty modes
- Advanced problem types and scrambling patterns
- Leaderboard integration with Redis
- Victory/defeat screens and scoring system

## 🧪 Game Mechanics

### Button Scrambling System
```typescript
// Easy Mode: Only numbers scrambled
numbers: { '1': '7', '2': '0', '3': '4', ... }
operators: { '+': '+', '-': '-', ... } // Normal

// Medium Mode: Numbers and operators scrambled separately
numbers: { '1': '9', '2': '3', ... }
operators: { '+': '×', '-': '÷', ... }

// Hard Mode: Numbers and operators mixed together
// God Tier: Even display values are scrambled!
```

### Problem Generation
Problems are generated based on difficulty with multiple valid solutions:
```typescript
{
  equation: "_ + _ = 7",
  targetValue: 7,
  possibleSolutions: ["1+6", "2+5", "3+4", "4+3", "5+2", "6+1"],
  difficulty: "easy"
}
```

## 📚 Documentation

- **[Development Guide](docs/development-guide.md)**: Detailed setup and development workflow
- **[Implementation Plan](docs/implementation-plan.md)**: Complete feature roadmap with checkpoints
- **[Hackathon Guide](docs/hackathon-guide.md)**: Quick reference for hackathon development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the BSD-3-Clause License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Inspired by classic Casio scientific calculators
- Built for the Reddit developer community
- Powered by Devvit platform

---

Ready to break some calculators? Start with `npm run dev:all` and create chaos! 🧮💥 