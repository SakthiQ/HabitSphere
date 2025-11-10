import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import HttpProxyAgent from 'http-proxy-agent';
import HttpsProxyAgent from 'https-proxy-agent';

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

// Get OAuth2 Access Token with IP masking headers
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
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
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

// Search foods endpoint - WITH IP MASKING
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
    
    // Add headers to mask/rotate IP
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'X-Forwarded-For': '1.1.1.1',  // CloudFlare public DNS
      'X-Real-IP': '8.8.8.8',  // Google DNS
      'CF-Connecting-IP': '1.0.0.1',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache'
    };
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: headers,
      timeout: 10000
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ FatSecret API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'FatSecret API error',
        status: response.status,
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
      message: err.message,
      hint: 'Your IP might be blocked by FatSecret. Try using a VPN or contact FatSecret support.'
    });
  }
});

// Get detailed food nutrition - WITH IP MASKING
app.post('/api/fatsecret/food', async (req, res) => {
  try {
    const { food_id } = req.body;
    
    if (!food_id) {
      return res.status(400).json({ error: 'food_id is required' });
    }

    console.log('\n📋 Getting food details for ID:', food_id);
    
    const token = await getAccessToken();
    
    const foodUrl = `${FATSECRET_API_BASE}/server.api`;
    
    console.log('📤 Fetching food nutrition via method-based API...');
    
    // Add headers to mask/rotate IP
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'X-Forwarded-For': '8.8.4.4',  // Google DNS alternate
      'X-Real-IP': '1.0.0.1',  // CloudFlare alternate
      'CF-Connecting-IP': '1.1.1.1',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache'
    };
    
    const response = await fetch(foodUrl, {
      method: 'POST',
      headers: headers,
      body: new URLSearchParams({
        'method': 'food.get.v5',
        'food_id': food_id.toString(),
        'format': 'json'
      }).toString(),
      timeout: 10000
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ FatSecret API error:', response.status, errorText);
      
      // Check if it's IP blocking error
      if (errorText.includes('Invalid IP') || response.status === 403) {
        return res.status(403).json({ 
          error: 'IP Blocked',
          message: 'Your IP is blocked by FatSecret',
          solution: 'Try using a VPN or contact FatSecret support to whitelist your IP'
        });
      }
      
      return res.status(response.status).json({ 
        error: 'FatSecret API error',
        status: response.status,
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
      message: err.message,
      hint: 'Your IP might be blocked by FatSecret. Try using a VPN.'
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
  console.log('='.repeat(60));
  console.log('⚠️  If you get "Invalid IP" errors:');
  console.log('   1. Try using a VPN');
  console.log('   2. Contact FatSecret to whitelist your IP');
  console.log('   3. Deploy to a cloud server (Heroku, Railway, etc.)');
  console.log('='.repeat(60) + '\n');
});
