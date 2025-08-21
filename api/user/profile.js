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

function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const decoded = verifyToken(req);
    const client = await connectToDatabase();
    const db = client.db('fxbot');
    const users = db.collection('users');

    if (req.method === 'GET') {
      // Get user profile
      const user = await users.findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { password: 0 } }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ success: true, user });

    } else if (req.method === 'PUT') {
      // Update user profile
      const { firstName, lastName, mobile } = req.body;

      const updateData = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (mobile) updateData.mobile = mobile;
      updateData.updatedAt = new Date();

      const result = await users.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Profile updated successfully' 
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Profile API error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}