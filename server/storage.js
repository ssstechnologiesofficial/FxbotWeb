import connectDB, { User, Contact, Newsletter, Deposit } from './database.js';
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

    // Update multi-level referral counts
    const { referralService } = await import('./referralService.js');
    await referralService.updateReferralCounts(user._id);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async getUserByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async getUserByMobile(mobile) {
    return await User.findOne({ mobile: mobile });
  }

  async getUserById(id) {
    return await User.findById(id).select('-password');
  }

  async updateUser(userId, updates) {
    return await User.findByIdAndUpdate(userId, { ...updates, updatedAt: new Date() }, { new: true });
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

  // Deposit methods
  async createDeposit(depositData) {
    try {
      const deposit = new Deposit(depositData);
      await deposit.save();
      return deposit;
    } catch (error) {
      console.error('Error creating deposit:', error);
      throw error;
    }
  }

  async getDepositsByUserId(userId) {
    try {
      return await Deposit.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching deposits:', error);
      throw error;
    }
  }

  async getAllDeposits() {
    try {
      return await Deposit.find().populate('userId', 'email firstName lastName').sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching all deposits:', error);
      throw error;
    }
  }

  async getDepositById(depositId) {
    try {
      return await Deposit.findById(depositId).populate('userId', 'email firstName lastName');
    } catch (error) {
      console.error('Error fetching deposit by ID:', error);
      throw error;
    }
  }

  async updateDepositStatus(depositId, updates) {
    try {
      return await Deposit.findByIdAndUpdate(depositId, { ...updates, updatedAt: new Date() }, { new: true });
    } catch (error) {
      console.error('Error updating deposit status:', error);
      throw error;
    }
  }

  // Password Reset Functions
  async generateResetToken() {
    // Generate secure random token
    const crypto = await import('crypto');
    return crypto.default.randomBytes(32).toString('hex');
  }

  async setResetToken(email, token) {
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    return await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        resetToken: token,
        resetTokenExpiry: expiry
      },
      { new: true }
    );
  }

  async getUserByResetToken(token) {
    return await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() } // Token not expired
    });
  }

  async clearResetToken(userId) {
    return await User.findByIdAndUpdate(userId, {
      resetToken: null,
      resetTokenExpiry: null
    });
  }

  async updatePassword(userId, newPassword) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    return await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    });
  }

  // KYC Management Functions
  async submitKycDocument(userId, documentUrl, fileName, fileType) {
    try {
      return await User.findByIdAndUpdate(userId, {
        kycStatus: 'pending',
        kycDocumentUrl: documentUrl,
        kycFileName: fileName,
        kycFileType: fileType,
        kycSubmittedAt: new Date()
      }, { new: true });
    } catch (error) {
      console.error('Error submitting KYC document:', error);
      throw error;
    }
  }

  async getKycSubmissions() {
    try {
      return await User.find({
        kycStatus: { $exists: true, $ne: null }
      }).select('firstName lastName email kycStatus kycDocumentUrl kycFileName kycSubmittedAt kycApprovedAt kycRejectedAt').sort({ kycSubmittedAt: -1 });
    } catch (error) {
      console.error('Error fetching KYC submissions:', error);
      throw error;
    }
  }

  async updateKycStatus(userId, status, adminId, rejectionReason = null) {
    try {
      const updateData = {
        kycStatus: status
      };

      if (status === 'approved') {
        updateData.kycApprovedAt = new Date();
        updateData.kycApprovedBy = adminId;
      } else if (status === 'rejected') {
        updateData.kycRejectedAt = new Date();
        updateData.kycRejectedBy = adminId;
        if (rejectionReason) {
          updateData.kycRejectionReason = rejectionReason;
        }
      }

      return await User.findByIdAndUpdate(userId, updateData, { new: true });
    } catch (error) {
      console.error('Error updating KYC status:', error);
      throw error;
    }
  }

  // Transaction Management Functions
  async createTransaction(transactionData) {
    try {
      const { Transaction } = await import('./database.js');
      const transaction = new Transaction(transactionData);
      await transaction.save();
      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async getUserTransactions(userId, page = 1, limit = 50) {
    try {
      const { Transaction } = await import('./database.js');
      const skip = (page - 1) * limit;
      
      const transactions = await Transaction.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Transaction.countDocuments({ userId });

      return {
        transactions,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
  }
}

let storage = null;

export function getStorage() {
  if (!storage) {
    storage = new MongoStorage();
  }
  return storage;
}