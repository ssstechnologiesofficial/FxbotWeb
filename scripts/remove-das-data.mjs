import mongoose from 'mongoose';
import connectDB, { User, Investment, Transaction } from '../server/database.js';

const dasUserFields = [
  'dasEnrollmentDate',
  'dasCountdownStartDate',
  'isEnrolledInDas',
  'totalInvestmentVolume',
  'dasTask1Completed',
  'dasTask2Completed',
  'dasTask3Completed',
  'dasTask1CompletedAt',
  'dasTask2CompletedAt',
  'dasTask3CompletedAt',
  'dasTask1Expired',
  'dasTask2Expired',
  'dasTask3Expired',
  'dasMonthlyEarnings',
  'dasIncome'
];

const summarize = async (model, filter) => {
  const [result] = await model.collection.aggregate([
    { $match: filter },
    { $group: { _id: null, count: { $sum: 1 }, amount: { $sum: '$amount' } } }
  ]).toArray();
  return { count: result?.count || 0, amount: result?.amount || 0 };
};

try {
  await connectDB();

  const nonDasInvestmentFilter = { packageType: { $ne: 'das' } };
  const nonDasTransactionFilter = { type: { $ne: 'das_income' } };
  const userDasFilter = { $or: dasUserFields.map(field => ({ [field]: { $exists: true } })) };
  const unsetFields = Object.fromEntries(dasUserFields.map(field => [field, '']));

  const before = {
    dasUsers: await User.collection.countDocuments(userDasFilter),
    dasInvestments: await summarize(Investment, { packageType: 'das' }),
    dasTransactions: await summarize(Transaction, { type: 'das_income' }),
    nonDasInvestments: await summarize(Investment, nonDasInvestmentFilter),
    nonDasTransactions: await summarize(Transaction, nonDasTransactionFilter)
  };

  const [users, investments, transactions] = await Promise.all([
    User.collection.updateMany(userDasFilter, { $unset: unsetFields }),
    Investment.collection.deleteMany({ packageType: 'das' }),
    Transaction.collection.deleteMany({ type: 'das_income' })
  ]);

  const after = {
    dasUsers: await User.collection.countDocuments(userDasFilter),
    dasInvestments: await summarize(Investment, { packageType: 'das' }),
    dasTransactions: await summarize(Transaction, { type: 'das_income' }),
    nonDasInvestments: await summarize(Investment, nonDasInvestmentFilter),
    nonDasTransactions: await summarize(Transaction, nonDasTransactionFilter)
  };

  const unchanged = JSON.stringify(before.nonDasInvestments) === JSON.stringify(after.nonDasInvestments)
    && JSON.stringify(before.nonDasTransactions) === JSON.stringify(after.nonDasTransactions);
  const purged = after.dasUsers === 0
    && after.dasInvestments.count === 0
    && after.dasTransactions.count === 0;

  console.log(JSON.stringify({
    affected: {
      users: users.modifiedCount,
      investments: investments.deletedCount,
      transactions: transactions.deletedCount
    },
    before,
    after,
    verification: { nonDasFinancialRecordsUnchanged: unchanged, dasDataPurged: purged }
  }, null, 2));

  if (!unchanged || !purged) {
    throw new Error('DAS cleanup verification failed');
  }
} finally {
  await mongoose.disconnect();
}