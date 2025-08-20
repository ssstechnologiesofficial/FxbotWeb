import mongoose from 'mongoose';
import { User, Investment, Transaction } from './database.js';
import { referralService } from './referralService.js';
import { DasService } from './dasService.js';

export class InvestmentService {
  
  // Process a new investment (from confirmed deposit)
  static async processInvestment(userId, amount, packageType = 'fs_income') {
    try {
      const session = await mongoose.startSession();
      session.startTransaction();

      // Create investment record
      const unlockDate = new Date();
      unlockDate.setMonth(unlockDate.getMonth() + 17); // Lock for 17 months
      
      const investment = new Investment({
        userId,
        amount,
        packageType,
        unlockDate,
        remainingReturns: amount * 2 // 2x return over 17 months
      });
      
      await investment.save({ session });

      // Update user's total investment amount
      await User.findByIdAndUpdate(userId, {
        $inc: { 
          totalInvestmentAmount: amount,
          totalInvestmentVolume: amount // For DAS tracking
        }
      }, { session });

      // Log the deposit transaction
      await this.logTransaction(userId, 'deposit', amount, 
        `Investment deposit - ${packageType}`, 'completed', investment._id, null, null, session);

      // Process Direct Income (DRI) - 6% to parent immediately
      await this.processDRIIncome(userId, amount, session);

      // Distribute SmartLine Income (5-tier commissions)
      await this.processSmartLineIncome(userId, amount, session);

      // Update DAS progress if user is enrolled
      const user = await User.findById(userId).session(session);
      if (user.isEnrolledInDas) {
        await DasService.addInvestment(userId, amount);
      }

      await session.commitTransaction();
      session.endSession();

      console.log(`Investment processed successfully: ${amount} for user ${userId}`);
      return true;

    } catch (error) {
      console.error('Error processing investment:', error);
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      return false;
    }
  }

  // Process Direct Income (DRI) - 6% to parent wallet
  static async processDRIIncome(userId, investmentAmount, session = null) {
    try {
      const user = await User.findById(userId).populate('parent').session(session);
      if (!user || !user.parent) return;

      const driAmount = investmentAmount * 0.06; // 6%
      
      // Add to parent's wallet balance and direct income
      await User.findByIdAndUpdate(user.parent._id, {
        $inc: {
          directIncome: driAmount,
          walletBalance: driAmount
        }
      }, { session });

      // Log DRI transaction for parent
      await this.logTransaction(
        user.parent._id, 
        'dri_income', 
        driAmount, 
        `Direct Income from ${user.firstName} ${user.lastName} investment`,
        'completed',
        null,
        userId,
        null,
        session
      );

      console.log(`DRI Income processed: $${driAmount} to parent ${user.parent._id}`);

    } catch (error) {
      console.error('Error processing DRI income:', error);
    }
  }

  // Process SmartLine Income (5-tier commissions)
  static async processSmartLineIncome(userId, investmentAmount, session = null) {
    try {
      const rewards = await referralService.distributeRewards(userId, investmentAmount);
      
      // Log SmartLine transactions for each level
      for (const reward of rewards) {
        await User.findByIdAndUpdate(reward.userId, {
          $inc: {
            smartLineIncome: reward.amount,
            walletBalance: reward.amount
          }
        }, { session });

        await this.logTransaction(
          reward.userId,
          'smartline_income',
          reward.amount,
          `Level ${reward.level} SmartLine commission (${(reward.rate * 100).toFixed(2)}%)`,
          'completed',
          null,
          userId,
          reward.level,
          session
        );
      }

      console.log(`SmartLine Income distributed for investment: ${investmentAmount}`);

    } catch (error) {
      console.error('Error processing SmartLine income:', error);
    }
  }

  // Daily FS Income distribution (called by scheduler at 11:59pm IST)
  static async distributeDailyFSIncome() {
    try {
      const activeInvestments = await Investment.find({ 
        status: 'active',
        packageType: 'fs_income',
        remainingReturns: { $gt: 0 }
      }).populate('userId');

      for (const investment of activeInvestments) {
        const dailyAmount = investment.amount * 0.002727; // 6% monthly / 22 days
        
        if (investment.remainingReturns >= dailyAmount) {
          // Update investment
          investment.remainingReturns -= dailyAmount;
          investment.totalReturns += dailyAmount;
          
          if (investment.remainingReturns <= 0) {
            investment.status = 'completed';
            investment.isActive = false;
          }
          
          await investment.save();

          // Update user's FS income and wallet
          await User.findByIdAndUpdate(investment.userId._id, {
            $inc: {
              fsIncome: dailyAmount,
              walletBalance: dailyAmount,
              dailyFsIncome: dailyAmount
            }
          });

          // Log FS Income transaction
          await this.logTransaction(
            investment.userId._id,
            'fs_income',
            dailyAmount,
            `Daily FS Income from investment of $${investment.amount}`,
            'completed',
            investment._id
          );
        }
      }

      console.log(`Daily FS Income distributed to ${activeInvestments.length} investments`);

    } catch (error) {
      console.error('Error distributing daily FS income:', error);
    }
  }

  // Get user's investment summary
  static async getUserInvestmentSummary(userId) {
    try {
      const user = await User.findById(userId);
      const investments = await Investment.find({ userId, status: 'active' });
      
      const activeInvestments = investments.length;
      const totalInvested = user.totalInvestmentAmount || 0;
      const totalReturns = investments.reduce((sum, inv) => sum + inv.totalReturns, 0);
      const pendingReturns = investments.reduce((sum, inv) => sum + inv.remainingReturns, 0);

      // Calculate total wallet balance from all income sources
      const totalWalletBalance = (user.totalEarnings || 0) + 
                                (user.directIncome || 0) + 
                                (user.fsIncome || 0) + 
                                (user.smartLineIncome || 0) + 
                                (user.walletBalance || 0) + 
                                (user.dailyFsIncome || 0) + 
                                (user.dasMonthlyEarnings || 0);

      return {
        totalInvestmentAmount: totalInvested,
        activeInvestments,
        totalReturns,
        pendingReturns,
        directIncome: user.directIncome || 0,
        fsIncome: user.fsIncome || 0,
        smartLineIncome: user.smartLineIncome || 0,
        walletBalance: totalWalletBalance,
        dailyFsIncome: user.dailyFsIncome || 0,
        dasMonthlyEarnings: user.dasMonthlyEarnings || 0
      };

    } catch (error) {
      console.error('Error getting investment summary:', error);
      return {
        totalInvestmentAmount: 0,
        activeInvestments: 0,
        totalReturns: 0,
        pendingReturns: 0,
        directIncome: 0,
        fsIncome: 0,
        smartLineIncome: 0,
        walletBalance: 0,
        dailyFsIncome: 0,
        dasMonthlyEarnings: 0
      };
    }
  }

  // Get user's transaction history
  static async getUserTransactionHistory(userId, page = 1, limit = 50) {
    try {
      const skip = (page - 1) * limit;
      
      const transactions = await Transaction.find({ userId })
        .populate('fromUserId', 'firstName lastName ownSponsorId')
        .populate('relatedInvestmentId', 'amount packageType')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Transaction.countDocuments({ userId });

      return {
        transactions,
        total,
        page,
        pages: Math.ceil(total / limit)
      };

    } catch (error) {
      console.error('Error getting transaction history:', error);
      return {
        transactions: [],
        total: 0,
        page: 1,
        pages: 0
      };
    }
  }

  // Log transaction
  static async logTransaction(userId, type, amount, description, status = 'completed', 
                             relatedInvestmentId = null, fromUserId = null, referralLevel = null, session = null) {
    try {
      const transaction = new Transaction({
        userId,
        type,
        amount,
        description,
        status,
        relatedInvestmentId,
        fromUserId,
        referralLevel
      });

      await transaction.save({ session });
      return transaction;

    } catch (error) {
      console.error('Error logging transaction:', error);
      return null;
    }
  }

  // Reset daily FS income (called daily to reset the counter)
  static async resetDailyFSIncome() {
    try {
      await User.updateMany({}, { dailyFsIncome: 0 });
      console.log('Daily FS Income counters reset');
    } catch (error) {
      console.error('Error resetting daily FS income:', error);
    }
  }

  // Get investment analytics for admin
  static async getInvestmentAnalytics() {
    try {
      const totalInvestments = await Investment.countDocuments();
      const totalVolume = await Investment.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const activeInvestments = await Investment.countDocuments({ status: 'active' });
      const completedInvestments = await Investment.countDocuments({ status: 'completed' });

      return {
        totalInvestments,
        totalVolume: totalVolume[0]?.total || 0,
        activeInvestments,
        completedInvestments
      };

    } catch (error) {
      console.error('Error getting investment analytics:', error);
      return {
        totalInvestments: 0,
        totalVolume: 0,
        activeInvestments: 0,
        completedInvestments: 0
      };
    }
  }
}