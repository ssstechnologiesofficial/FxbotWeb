import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

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

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      firstName, 
      lastName, 
      email, 
      mobile, 
      password, 
      sponsorId 
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !mobile || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const client = await connectToDatabase();
    const db = client.db('fxbot');
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({
      $or: [
        { email: email.toLowerCase() },
        { mobile }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email.toLowerCase() 
          ? 'Email already registered' 
          : 'Mobile number already registered' 
      });
    }

    // Find sponsor if sponsorId provided
    let sponsor = null;
    if (sponsorId) {
      sponsor = await users.findOne({ sponsorId });
      if (!sponsor) {
        return res.status(400).json({ error: 'Invalid sponsor ID' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate unique sponsor ID
    let newSponsorId;
    let isUnique = false;
    while (!isUnique) {
      newSponsorId = Math.random().toString(36).substr(2, 8).toUpperCase();
      const existing = await users.findOne({ sponsorId: newSponsorId });
      if (!existing) isUnique = true;
    }

    // Create user object
    const newUser = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,
      sponsorId: newSponsorId,
      parentSponsorId: sponsorId || null,
      balance: 0,
      totalInvestment: 0,
      totalWithdrawn: 0,
      kycStatus: 'pending',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert user
    const result = await users.insertOne(newUser);

    // Update sponsor's referral count if sponsor exists
    if (sponsor) {
      await users.updateOne(
        { _id: sponsor._id },
        { 
          $inc: { referralCount: 1 },
          $set: { updatedAt: new Date() }
        }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.insertedId, 
        email: newUser.email,
        isAdmin: false 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = { ...newUser, _id: result.insertedId };

    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}