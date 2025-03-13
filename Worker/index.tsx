// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { KVNamespace } from '@cloudflare/workers-types';

// Type definitions for narrative state and final metadata
interface NarrativeState {
  choices: string[];
  createdAt: number;
}

interface FinalMetadata {
  narrativeText: string;
  artUrl: string;
  mojoScore: number;
  ipfsUrl: string;
  timestamp: number;
}

// Environment interface (bindings and environment variables)
interface Env {
  // KV namespace binding using your provided namespace name
  narrativesjamkiller: KVNamespace;
  // IPFS upload endpoint provided via QuickNode
  IPFS_UPLOAD_URL: string;
  // IPFS API key provided by QuickNode
  IPFS_API_KEY: string;
}

// Create a Hono app instance
const app = new Hono<{ Bindings: Env }>();

// Apply CORS and security headers
app.use('*', cors());
app.use('*', async (c, next) => {
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('Referrer-Policy', 'no-referrer');
  c.header('Content-Security-Policy', "default-src 'self'");
  await next();
});

/**
 * POST /narrative/update/:userId
 * Appends a new choice to the user's narrative state stored in the KV namespace "narrativesjamkiller".
 */
app.post('/narrative/update/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const { choice } = await c.req.json<{ choice: string }>();
    if (!choice) {
      return c.json({ error: 'Missing choice in request' }, 400);
    }

    // Retrieve existing narrative state from KV
    const existingData = await c.env.narrativesjamkiller.get(userId);
    let state: NarrativeState;
    if (existingData) {
      state = JSON.parse(existingData);
      state.choices.push(choice);
    } else {
      state = { choices: [choice], createdAt: Date.now() };
    }
    // Update narrative state in KV
    await c.env.narrativesjamkiller.put(userId, JSON.stringify(state));
    return c.json({ message: 'Narrative updated successfully', state });
  } catch (error) {
    console.error('Error updating narrative:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * POST /narrative/finalize/:userId
 * Finalizes the narrative: composes final narrative text and prompt,
 * computes a mojo score, internally calls the artistic worker to generate art,
 * uploads the metadata to IPFS, and returns the final metadata.
 */
app.post('/narrative/finalize/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const stored = await c.env.narrativesjamkiller.get(userId);
    if (!stored) {
      return c.json({ error: 'No narrative state found for this user' }, 404);
    }
    const state: NarrativeState = JSON.parse(stored);

    // Compose final narrative text (example: simply list choices)
    const narrativeText = `Your journey: ${state.choices.join(' -> ')}`;
    // Generate a final prompt for art generation
    const finalPrompt = `Create an image that represents: ${narrativeText}`;
    // Compute a mojo score (e.g., number of choices * 10 plus a time-based factor)
    const mojoScore = state.choices.length * 10 + (Date.now() % 100);

    // Internal call to the artistic worker endpoint
    const artisticWorkerUrl = 'https://artisticjammer.fletcher-christians-account3359.workers.dev/generate';
    const artResponse = await fetch(artisticWorkerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: finalPrompt }),
    });
    if (!artResponse.ok) {
      console.error('Artistic worker call failed');
      return c.json({ error: 'Failed to generate art' }, 500);
    }
    const artData = await artResponse.json<{ artUrl: string }>();
    const artUrl = artData.artUrl;

    // Combine final metadata
    const finalMetadata: FinalMetadata = {
      narrativeText,
      artUrl,
      mojoScore,
      ipfsUrl: '', // to be updated after IPFS upload
      timestamp: Date.now(),
    };

    // Upload final metadata to IPFS via your QuickNode endpoint
    const ipfsResponse = await fetch(c.env.IPFS_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${c.env.IPFS_API_KEY}`
      },
      body: JSON.stringify(finalMetadata),
    });
    if (!ipfsResponse.ok) {
      console.error('IPFS upload failed');
      return c.json({ error: 'Failed to upload metadata to IPFS' }, 500);
    }
    const ipfsData = await ipfsResponse.json() as { ipfsUrl: string };
    finalMetadata.ipfsUrl = ipfsData.ipfsUrl;

    // Return final metadata (narrative text, art URL, mojo score, IPFS URL)
    return c.json({ message: 'Narrative finalized successfully', metadata: finalMetadata });
  } catch (error) {
    console.error('Error finalizing narrative:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;