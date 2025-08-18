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
  level5Earnings: { type: Number, default: 0 }
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

export const User = mongoose.model('User', userSchema);
export const Contact = mongoose.model('Contact', contactSchema);
export const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default connectDB;