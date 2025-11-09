import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const FATSECRET_OAUTH_URL = 'https://oauth.fatsecret.com/connect/token';
const FATSECRET_API_BASE = 'https://platform.fatsecret.com/rest';

const CLIENT_ID = process.env.FATSECRET_CLIENT_ID;
const CLIENT_SECRET = process.env.FATSECRET_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ ERROR: Missing FATSECRET_CLIENT_ID or FATSECRET_CLIENT_SECRET in .env');
  process.exit(1);
}

console.log('✅ Credentials loaded successfully');

let accessToken = null;
let tokenExpiry = 0;

// Get OAuth2 Access Token
async function getAccessToken() {
  const now = Date.now();
  
  if (accessToken && tokenExpiry > now + 60000) {
    console.log('✅ Using cached access token');
    return accessToken;
  }

  console.log('🔄 Fetching new access token from FatSecret...');
  
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);

  try {
    const res = await fetch(FATSECRET_OAUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ OAuth Error:', res.status, errorText);
      throw new Error(`OAuth failed: ${errorText}`);
    }

    const data = await res.json();
    accessToken = data.access_token;
    tokenExpiry = now + (data.expires_in * 1000);
    console.log('✅ New access token obtained');
    return accessToken;
  } catch (err) {
    console.error('❌ Failed to get access token:', err.message);
    throw err;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running ✅' });
});

// Search foods endpoint
app.post('/api/fatsecret/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log('\n🔍 Searching for:', query);
    
    const token = await getAccessToken();
    
    const searchUrl = `${FATSECRET_API_BASE}/foods/search/v1?search_expression=${encodeURIComponent(query)}&max_results=10&format=json`;
    
    console.log('📤 Calling FatSecret Food Search API...');
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ FatSecret API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'FatSecret API error',
        details: errorText 
      });
    }

    const data = await response.json();
    console.log('✅ Found', data.foods?.food?.length || 0, 'foods');
    res.json(data);
  } catch (err) {
    console.error('❌ Error in search:', err.message);
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
});

// Get detailed food nutrition - METHOD-BASED API
app.post('/api/fatsecret/food', async (req, res) => {
  try {
    const { food_id } = req.body;
    
    if (!food_id) {
      return res.status(400).json({ error: 'food_id is required' });
    }

    console.log('\n📋 Getting food details for ID:', food_id);
    
    const token = await getAccessToken();
    
    // Use method-based API (more reliable)
    const foodUrl = `${FATSECRET_API_BASE}/server.api`;
    
    console.log('📤 Fetching food nutrition via method-based API...');
    const response = await fetch(foodUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'method': 'food.get.v5',
        'food_id': food_id.toString(),
        'format': 'json'
      }).toString()
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ FatSecret API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'FatSecret API error',
        details: errorText 
      });
    }

    const data = await response.json();
    console.log('✅ Food details retrieved');
    console.log('📊 Servings:', data.food?.servings?.serving ? 'Found' : 'Not found');
    res.json(data);
  } catch (err) {
    console.error('❌ Error fetching food:', err.message);
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
});

app.listen(port, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 FatSecret Proxy Server Running');
  console.log('='.repeat(60));
  console.log(`📍 Server URL: http://localhost:${port}`);
  console.log(`🔍 Search Endpoint: POST http://localhost:${port}/api/fatsecret/search`);
  console.log(`📋 Food Details: POST http://localhost:${port}/api/fatsecret/food`);
  console.log(`❤️  Health Check: GET http://localhost:${port}/api/health`);
  console.log('='.repeat(60) + '\n');
});
