import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const TEST_DATABASE = "fxbot_test";
const CONFIRMATION_FLAG = "--confirm";

if (!process.env.MONGODB_URI) {
  console.error("Test database seed failed: MONGODB_URI is not set");
  process.exit(1);
}

if (!process.argv.includes(CONFIRMATION_FLAG)) {
  console.error(
    `Refusing to write without ${CONFIRMATION_FLAG}. This creates synthetic data in the isolated "${TEST_DATABASE}" database.`,
  );
  process.exit(1);
}

const connection = await mongoose
  .createConnection(process.env.MONGODB_URI, {
    dbName: TEST_DATABASE,
    bufferCommands: false,
    serverSelectionTimeoutMS: 10_000,
  })
  .asPromise();

const now = new Date();
const userId = new mongoose.Types.ObjectId();
const adminId = new mongoose.Types.ObjectId();
const investmentId = new mongoose.Types.ObjectId();
const depositId = new mongoose.Types.ObjectId();
const withdrawalId = new mongoose.Types.ObjectId();

try {
  const password = await bcrypt.hash("TestPassword123!", 10);
  const sponsorId = "FX900001";
  const adminSponsorId = "FX900000";

  // The fixed marker makes this seed safe to rerun: only its own synthetic
  // records are replaced, and no existing customer-shaped records are touched.
  const seedMarker = "fxbot-local-test-seed-v1";
  const users = [
    {
      _id: adminId,
      seedMarker,
      sponsorId: adminSponsorId,
      ownSponsorId: "FX900000",
      firstName: "Test",
      lastName: "Admin",
      mobile: "9000000000",
      email: "test.admin@example.invalid",
      password,
      role: "admin",
      isActive: true,
      referralCount: 1,
      children: [userId],
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: userId,
      seedMarker,
      sponsorId,
      ownSponsorId: "FX900001",
      firstName: "Test",
      lastName: "Customer",
      mobile: "9000000001",
      email: "test.customer@example.invalid",
      password,
      role: "user",
      isActive: true,
      parent: adminId,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const investments = [
    {
      _id: investmentId,
      seedMarker,
      userId,
      amount: 250,
      packageType: "fs_income",
      status: "active",
      lockPeriod: 17,
      unlockDate: new Date(now.getTime() + 17 * 30 * 24 * 60 * 60 * 1000),
      totalReturns: 0,
      remainingReturns: 500,
      dailyFsRate: 0.002727,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const transactions = [
    {
      seedMarker,
      userId,
      type: "deposit",
      amount: 250,
      description: "Synthetic test deposit",
      status: "completed",
      relatedInvestmentId: investmentId,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const deposits = [
    {
      _id: depositId,
      seedMarker,
      userId,
      amount: 250,
      walletType: "USDT",
      walletAddress: "TEST_ONLY_NOT_A_REAL_WALLET",
      paymentMethod: "USDT TRC-20",
      screenshotPath: "test-only/no-real-payment.png",
      screenshotUrl: "test-only/no-real-payment.png",
      status: "confirmed",
      adminActionAt: now,
      adminActionBy: adminId,
      adminNotes: "Synthetic test record; no payment was made",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const withdrawals = [
    {
      _id: withdrawalId,
      seedMarker,
      userId,
      amount: 15.2,
      requestedAmount: 16,
      serviceCharge: 0.8,
      method: "USDT",
      walletAddress: "TEST_ONLY_NOT_A_REAL_WALLET",
      status: "completed",
      otpVerified: true,
      otpVerifiedAt: now,
      adminNotes: "Synthetic test record; no payment was made",
      adminActionAt: now,
      adminActionBy: adminId,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const contacts = [
    {
      seedMarker,
      firstName: "Test",
      lastName: "Visitor",
      email: "test.visitor@example.invalid",
      subject: "Synthetic contact",
      message: "This is a synthetic test record.",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const newsletters = [
    {
      seedMarker,
      email: "test.subscriber@example.invalid",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const otps = [
    {
      seedMarker,
      userId,
      withdrawalId,
      otp: "000000",
      purpose: "withdrawal",
      isUsed: true,
      expiresAt: now,
      createdAt: now,
    },
  ];

  const collections = {
    users,
    investments,
    transactions,
    deposits,
    withdrawals,
    contacts,
    newsletters,
    otps,
  };

  for (const [collectionName, documents] of Object.entries(collections)) {
    const collection = connection.db.collection(collectionName);
    await collection.deleteMany({ seedMarker });
    await collection.insertMany(documents);
  }

  await connection.db.collection("users").createIndex({ email: 1 }, { unique: true });
  await connection.db
    .collection("users")
    .createIndex({ ownSponsorId: 1 }, { unique: true });
  await connection.db
    .collection("newsletters")
    .createIndex({ email: 1 }, { unique: true });

  const counts = {};
  for (const collectionName of Object.keys(collections)) {
    counts[collectionName] = await connection.db
      .collection(collectionName)
      .countDocuments({ seedMarker });
  }

  console.log(
    JSON.stringify({
      database: connection.name,
      seedMarker,
      syntheticOnly: true,
      counts,
    }),
  );
} finally {
  await connection.close();
}