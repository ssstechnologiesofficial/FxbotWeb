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

  // User management
  async createUser(userData) {
    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    const user = new User({
      ...userData,
      password: hashedPassword
    });
    
    await user.save();
    
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
}

let storage = null;

export function getStorage() {
  if (!storage) {
    storage = new MongoStorage();
  }
  return storage;
}