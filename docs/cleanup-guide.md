# BrokenCalc - Template Cleanup Guide

This guide will help you clean up the Reddit Devvit template and prepare the codebase for developing **BrokenCalc**.

## Overview

The current template contains a complete Wordle-like word guessing game that needs to be removed. This cleanup will:
- Remove all word guessing game logic and components
- Clear out unnecessary files and dependencies
- Update project naming and configuration
- Create a clean foundation for BrokenCalc development

## Files to Delete

### 1. Game-Specific Components
```bash
# Remove word guessing game components
rm src/client/Game.tsx
rm src/client/Keyboard.tsx
rm src/client/game.css
```

### 2. Server Logic Files
```bash
# Remove word guessing server logic
rm src/server/core/post.ts
rm src/server/core/words.ts
```

### 3. Game Types
```bash
# Remove game-specific type definitions
rm src/shared/types/game.ts
```

### 4. Template Documentation
```bash
# Remove template-specific documentation
rm README.md
rm -rf docs-img/
```

## Files to Update

### 1. Package.json
**Location:** `package.json`

**Changes needed:**
- Update project name from `"devvit-react-starter-experimental"` to `"broken-calc"`
- Update the `dev:devvit` script to use your actual subreddit name
- Remove unused dependencies (if any become unused after cleanup)

```json
{
  "name": "broken-calc",
  "version": "0.0.0",
  // ... rest of config
}
```

### 2. Client App Component
**Location:** `src/client/App.tsx`

**Replace entire content with:**
```tsx
import { BoltBadge } from './BoltBadge';

export const App = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            BrokenCalc
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            Coming Soon...
          </p>
        </div>
      </div>
      <BoltBadge mode="white" />
    </>
  );
};
```

### 3. Client CSS
**Location:** `src/client/index.css`

**Replace game-specific styles with:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 4. Devvit Main Component
**Location:** `src/devvit/main.tsx`

**Replace entire content with:**
```tsx
import { Devvit, Post } from '@devvit/public-api';

// Side effect import to bundle the server
import '../server/index';
import { defineConfig } from '@devvit/server';

defineConfig({
  name: 'BrokenCalc',
  entry: 'index.html',
  height: 'tall',
  menu: { enable: false },
});

export const Preview: Devvit.BlockComponent<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <zstack width={'100%'} height={'100%'} alignment="center middle">
      <vstack width={'100%'} height={'100%'} alignment="center middle">
        <image
          url="loading.gif"
          description="Loading..."
          height={'140px'}
          width={'140px'}
          imageHeight={'240px'}
          imageWidth={'240px'}
        />
        <spacer size="small" />
        <text maxWidth={`80%`} size="large" weight="bold" alignment="center middle" wrap>
          {text}
        </text>
      </vstack>
    </zstack>
  );
};

Devvit.addMenuItem({
  label: 'BrokenCalc: New Post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;

    let post: Post | undefined;
    try {
      const subreddit = await reddit.getCurrentSubreddit();
      post = await reddit.submitPost({
        title: 'BrokenCalc',
        subredditName: subreddit.name,
        preview: <Preview />,
      });
      ui.showToast({ text: 'Created BrokenCalc post!' });
      ui.navigateTo(post.url);
    } catch (error) {
      if (post) {
        await post.remove(false);
      }
      if (error instanceof Error) {
        ui.showToast({ text: `Error creating post: ${error.message}` });
      } else {
        ui.showToast({ text: 'Error creating post!' });
      }
    }
  },
});

export default Devvit;
```

### 5. Server Index
**Location:** `src/server/index.ts`

**Replace entire content with:**
```typescript
import express from 'express';
import { createServer, getServerPort } from '@devvit/server';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

// Health check endpoint
router.get('/api/health', async (_req, res) => {
  res.json({ status: 'ok', app: 'BrokenCalc' });
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port, () => console.log(`BrokenCalc server running on http://localhost:${port}`));
```

### 6. Create Basic Shared Types
**Location:** `src/shared/types/game.ts`

**Create with minimal content:**
```typescript
// Basic response type for API calls
export type ApiResponse<T> = 
  | { status: 'success' } & T
  | { status: 'error'; message: string };

// Add BrokenCalc specific types here as needed
```

## Cleanup Steps Summary

1. **Delete unnecessary files** (see "Files to Delete" section above)
2. **Update remaining files** with BrokenCalc-specific content
3. **Test the cleanup** by running `npm run dev:all`
4. **Verify the app loads** with just the BrokenCalc title and vibrant background
5. **Update your subreddit name** in `package.json` if you haven't already

## Post-Cleanup Verification

After completing the cleanup:

1. **Run the development server:**
   ```bash
   npm run dev:all
   ```

2. **Check the client preview** at `http://localhost:7474` - you should see:
   - Vibrant gradient background (purple to pink to orange)
   - Large "BrokenCalc" title in white
   - "Coming Soon..." subtitle

3. **Test the Devvit app** in your subreddit by creating a new post

4. **Verify the server** is running without errors

## Next Steps

Once cleanup is complete, you'll have a clean foundation to build BrokenCalc. The project will be ready for:
- Adding calculator functionality
- Implementing the "broken" game mechanics
- Creating the user interface
- Adding game logic and scoring

Your codebase will be clean, organized, and ready for development! 