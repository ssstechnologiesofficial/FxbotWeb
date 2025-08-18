import connectDB, { User, Contact, Newsletter } from './database.js';
import bcrypt from 'bcryptjs';

// MongoDB Storage implementation
class MongoStorage {
  constructor() {
    // Initialize database connection
    connectDB();
  }

  // Contact form submissions
  async createContact(contactData) {
    const contact = new Contact(contactData);
    await contact.save();
    return contact;
  }

  async getContacts() {
    return await Contact.find().sort({ createdAt: -1 });
  }

  // Newsletter subscriptions
  async createSubscriber(email) {
    const subscriber = new Newsletter({ email });
    await subscriber.save();
    return subscriber;
  }

  async getSubscribers() {
    return await Newsletter.find().sort({ createdAt: -1 });
  }

  // Generate unique sponsor ID
  async generateUniqueSponsorId() {
    let sponsorId;
    let isUnique = false;
    
    while (!isUnique) {
      // Generate 6-digit random number
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      sponsorId = `FX${randomNumber}`;
      
      // Check if this ID already exists
      const existing = await User.findOne({ ownSponsorId: sponsorId });
      if (!existing) {
        isUnique = true;
      }
    }
    
    return sponsorId;
  }

  // Find sponsor by their sponsor ID
  async findSponsor(sponsorId) {
    return await User.findOne({ ownSponsorId: sponsorId });
  }

  // User management
  async createUser(userData) {
    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    // Generate unique sponsor ID for this user
    const ownSponsorId = await this.generateUniqueSponsorId();
    
    // Find the sponsor (parent) if sponsorId is provided
    let parent = null;
    if (userData.sponsorId) {
      parent = await this.findSponsor(userData.sponsorId);
    }
    
    const user = new User({
      ...userData,
      password: hashedPassword,
      ownSponsorId,
      parent: parent ? parent._id : null
    });
    
    await user.save();
    
    // Update parent's children array and referral count
    if (parent) {
      await User.findByIdAndUpdate(parent._id, {
        $push: { children: user._id },
        $inc: { referralCount: 1 }
      });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async getUserByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async getUserById(id) {
    return await User.findById(id).select('-password');
  }

  async getUsers() {
    return await User.find().select('-password').sort({ createdAt: -1 });
  }

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async getUserReferrals(userId) {
    const user = await User.findById(userId).populate('children', 'firstName lastName email createdAt');
    return user ? user.children : [];
  }
}

let storage = null;

export function getStorage() {
  if (!storage) {
    storage = new MongoStorage();
  }
  return storage;
}