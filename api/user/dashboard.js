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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decoded = verifyToken(req);
    const client = await connectToDatabase();
    const db = client.db('fxbot');
    const users = db.collection('users');
    const transactions = db.collection('transactions');

    // Get user data
    const user = await users.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get referral count
    const referralCount = await users.countDocuments({ 
      parentSponsorId: user.sponsorId 
    });

    // Get recent transactions
    const recentTransactions = await transactions.find(
      { userId: user._id.toString() }
    )
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

    // Calculate total earnings
    const totalEarnings = await transactions.aggregate([
      { 
        $match: { 
          userId: user._id.toString(),
          type: { $in: ['FS Income', 'DRI Income', 'SmartLine Income', 'DAS Income'] }
        }
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$amount' } 
        } 
      }
    ]).toArray();

    const dashboardData = {
      user: {
        ...user,
        referralCount
      },
      stats: {
        totalBalance: user.balance || 0,
        totalInvestment: user.totalInvestment || 0,
        totalEarnings: totalEarnings.length > 0 ? totalEarnings[0].total : 0,
        totalWithdrawn: user.totalWithdrawn || 0
      },
      recentTransactions
    };

    res.status(200).json({ 
      success: true, 
      data: dashboardData 
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}