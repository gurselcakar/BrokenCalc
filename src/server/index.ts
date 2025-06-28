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