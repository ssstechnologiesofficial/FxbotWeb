import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  sponsorId: {
    type: String,
    required: true
  },
  ownSponsorId: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: 'Mobile number must be exactly 10 digits'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  referralCount: {
    type: Number,
    default: 0
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  level1Count: { type: Number, default: 0 },
  level2Count: { type: Number, default: 0 },
  level3Count: { type: Number, default: 0 },
  level4Count: { type: Number, default: 0 },
  level5Count: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  level1Earnings: { type: Number, default: 0 },
  level2Earnings: { type: Number, default: 0 },
  level3Earnings: { type: Number, default: 0 },
  level4Earnings: { type: Number, default: 0 },
  level5Earnings: { type: Number, default: 0 },
  
  // Password Reset
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
  
  // DAS program fields
  dasEnrollmentDate: { type: Date, default: null },
  dasCountdownStartDate: { type: Date, default: null },
  isEnrolledInDas: { type: Boolean, default: false },
  totalInvestmentVolume: { type: Number, default: 0 },
  dasTask1Completed: { type: Boolean, default: false },
  dasTask2Completed: { type: Boolean, default: false },
  dasTask3Completed: { type: Boolean, default: false },
  dasTask1CompletedAt: { type: Date, default: null },
  dasTask2CompletedAt: { type: Date, default: null },
  dasTask3CompletedAt: { type: Date, default: null },
  dasMonthlyEarnings: { type: Number, default: 0 },
  
  // Investment tracking fields
  totalInvestmentAmount: { type: Number, default: 0 },
  directIncome: { type: Number, default: 0 }, // 6% from direct referrals
  fsIncome: { type: Number, default: 0 }, // FS (FixSix) monthly returns
  smartLineIncome: { type: Number, default: 0 }, // 5-tier commissions (already handled by levelXEarnings)
  walletBalance: { type: Number, default: 0 }, // Total withdrawable amount
  totalWithdrawn: { type: Number, default: 0 },
  dailyFsIncome: { type: Number, default: 0 }, // Today's FS income credit
  
  // KYC fields
  kycStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: null 
  },
  kycDocumentUrl: { type: String, default: null },
  kycFileName: { type: String, default: null },
  kycFileType: { type: String, default: null },
  kycSubmittedAt: { type: Date, default: null },
  kycApprovedAt: { type: Date, default: null },
  kycRejectedAt: { type: Date, default: null },
  kycApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  kycRejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  kycRejectionReason: { type: String, default: null }
}, {
  timestamps: true
});

// Contact Schema
const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true
});

// Investment Schema for tracking volume
const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  packageType: {
    type: String,
    enum: ['fs_income', 'smartline', 'dri', 'das'],
    default: 'fs_income'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  lockPeriod: {
    type: Number,
    default: 17 // months
  },
  unlockDate: {
    type: Date
  },
  totalReturns: {
    type: Number,
    default: 0
  },
  remainingReturns: {
    type: Number
  },
  dailyFsRate: {
    type: Number,
    default: 0.002727 // 6% monthly / 22 days
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Transaction Schema for logging all activities
const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'fs_income', 'dri_income', 'smartline_income', 'das_income', 'withdrawal'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  relatedInvestmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    default: null
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referralLevel: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Deposit Schema
const depositSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 250 },
  walletType: { type: String, required: true },
  walletAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  adminNotes: { type: String }
});

// Withdrawal Schema
const withdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 15 },
  requestedAmount: { type: Number, required: true }, // Original amount before service charge
  serviceCharge: { type: Number, required: true }, // 5% service charge
  method: { type: String, required: true },
  walletAddress: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending_otp', 'pending_admin', 'approved', 'rejected', 'completed'], 
    default: 'pending_otp' 
  },
  otpVerified: { type: Boolean, default: false },
  otpVerifiedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  adminNotes: { type: String },
  adminActionAt: { type: Date },
  adminActionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// OTP Schema for withdrawal verification
const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  withdrawalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Withdrawal', required: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['withdrawal'], required: true },
  isUsed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
export const Contact = mongoose.model('Contact', contactSchema);
export const Newsletter = mongoose.model('Newsletter', newsletterSchema);
export const Investment = mongoose.model('Investment', investmentSchema);
export const Deposit = mongoose.model('Deposit', depositSchema);
export const Transaction = mongoose.model('Transaction', transactionSchema);
export const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
export const OTP = mongoose.model('OTP', otpSchema);

export default connectDB;