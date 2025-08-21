import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

function verifyAdminToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
  
  if (!decoded.isAdmin) {
    throw new Error('Admin access required');
  }
  
  return decoded;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    verifyAdminToken(req);
    
    const client = await connectToDatabase();
    const db = client.db('fxbot');
    const users = db.collection('users');

    const allUsers = await users.find(
      {},
      { projection: { password: 0 } }
    ).sort({ createdAt: -1 }).toArray();

    res.status(200).json({ 
      success: true, 
      users: allUsers 
    });

  } catch (error) {
    console.error('Admin users API error:', error);
    if (error.message === 'No token provided' || error.message === 'Admin access required') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}