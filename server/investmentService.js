import mongoose from 'mongoose';
import { User, Investment, Transaction } from './database.js';
import { DasService } from './dasService.js';
import { referralService } from './referralService.js';

export class InvestmentService {
  
  // Process a new investment (from confirmed deposit)
  static async processInvestment(userId, amount, packageType = 'fs_income') {
    let session = null;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        session = await mongoose.startSession();
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
        try {
          await this.processDRIIncome(userId, amount, session);
        } catch (driError) {
          console.error('❌ DRI processing failed in transaction, will retry separately:', driError);
          // Don't fail the entire transaction for DRI issues
        }

        // Distribute SmartLine Income (5-tier commissions)
        try {
          await this.processSmartLineIncome(userId, amount, session);
        } catch (smartlineError) {
          console.error('❌ SmartLine processing failed in transaction:', smartlineError);
          // Don't fail the entire transaction for SmartLine issues
        }

        // Update DAS progress if user is enrolled
        const user = await User.findById(userId).session(session);
        if (user.isEnrolledInDas) {
          await DasService.addInvestment(userId, amount);
        }

        await session.commitTransaction();
        session.endSession();

        console.log(`Investment processed successfully: ${amount} for user ${userId}`);
        
        // Get user details for logging
        const userData = await User.findById(userId).select('firstName lastName email');
        console.log(`Investment processed: $${amount} for user`, {
          _id: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        });
        
        // Process DRI and SmartLine separately if they failed in transaction
        console.log(`🔄 Running post-transaction income processing for user ${userId}, amount $${amount}`);
        try {
          console.log(`🔄 Starting DRI processing outside transaction...`);
          await this.processDRIIncome(userId, amount);
          console.log(`🔄 Starting SmartLine processing outside transaction...`);
          await this.processSmartLineIncome(userId, amount);
          console.log(`✅ Post-transaction income processing completed successfully`);
        } catch (postTransactionError) {
          console.error('❌ Post-transaction income processing failed:', postTransactionError);
        }
        
        return true;

      } catch (error) {
        console.error('Error during investment processing:', error);
        
        if (session) {
          try {
            await session.abortTransaction();
            session.endSession();
          } catch (abortError) {
            console.error('Error aborting transaction:', abortError);
          }
          session = null;
        }
        
        // Check if it's a transient transaction error that we can retry
        if (error.errorLabels && error.errorLabels.includes('TransientTransactionError') && retryCount < maxRetries - 1) {
          retryCount++;
          console.log(`Retrying transaction attempt ${retryCount + 1}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, 100 * retryCount)); // Exponential backoff
          continue;
        }
        
        return false;
      }
    }
    
    return false;
  }

  // Process Direct Income (DRI) - 6% to parent wallet
  static async processDRIIncome(userId, investmentAmount, session = null) {
    try {
      console.log(`🔍 DRI Processing started for user ${userId}, amount $${investmentAmount}, session: ${!!session}`);
      
      let user;
      if (session) {
        user = await User.findById(userId).populate('parent').session(session);
      } else {
        user = await User.findById(userId).populate('parent');
      }
      
      if (!user) {
        console.log(`🔍 DRI Debug - User not found: ${userId}`);
        return;
      }
      
      if (!user.parent) {
        console.log(`🔍 DRI Debug - No parent found for user: ${userId} (${user.firstName} ${user.lastName})`);
        return;
      }

      const driAmount = investmentAmount * 0.06; // 6%
      
      console.log(`🔍 DRI Debug - Processing: $${driAmount} from ${user.firstName} ${user.lastName} (${userId}) to parent ${user.parent._id}`);
      
      // Add to parent's wallet balance and direct income
      await User.findByIdAndUpdate(user.parent._id, {
        $inc: {
          directIncome: driAmount,
          walletBalance: driAmount
        }
      }, { session });

      // Log DRI transaction for parent
      console.log(`💰 Creating DRI transaction: $${driAmount} for parent ${user.parent._id}`);
      
      try {
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
        console.log(`✅ DRI transaction logged successfully for parent ${user.parent._id}`);
      } catch (txnError) {
        console.error(`❌ Failed to log DRI transaction:`, txnError);
        // Try again without session
        try {
          await this.logTransaction(
            user.parent._id, 
            'dri_income', 
            driAmount, 
            `Direct Income from ${user.firstName} ${user.lastName} investment`,
            'completed',
            null,
            userId,
            null,
            null
          );
          console.log(`✅ DRI transaction logged successfully (without session) for parent ${user.parent._id}`);
        } catch (retryError) {
          console.error(`❌ Failed to log DRI transaction even without session:`, retryError);
        }
      }

      console.log(`✅ DRI Income processed: $${driAmount} to parent ${user.parent._id}`);

    } catch (error) {
      console.error('❌ Error processing DRI income:', error);
    }
  }

  // Process SmartLine Income (5-tier commissions)
  static async processSmartLineIncome(userId, investmentAmount, session = null) {
    try {
      const rewards = await referralService.distributeRewards(userId, investmentAmount);
      
      // Check if rewards is valid array
      if (!rewards || !Array.isArray(rewards)) {
        console.log(`🔍 SmartLine Debug - No rewards returned for user ${userId}, amount ${investmentAmount}`);
        return;
      }
      
      console.log(`🔍 SmartLine Debug - Processing ${rewards.length} rewards for user ${userId}`);
      
      // Log SmartLine transactions for each level
      for (const reward of rewards) {
        await User.findByIdAndUpdate(reward.userId, {
          $inc: {
            smartLineIncome: reward.amount,
            walletBalance: reward.amount
          }
        }, { session });

        // Get the referrer's details for better transaction description
        let referrer;
        if (session) {
          referrer = await User.findById(userId).session(session);
        } else {
          referrer = await User.findById(userId);
        }
        
        console.log(`💰 Creating SmartLine transaction: $${reward.amount} for user ${reward.userId}, Level ${reward.level}`);
        
        try {
          await this.logTransaction(
            reward.userId,
            'smartline_income',
            reward.amount,
            `Level ${reward.level} SmartLine Income (${(reward.rate * 100).toFixed(2)}%) from ${referrer.firstName} ${referrer.lastName} - Deposit: $${investmentAmount}`,
            'completed',
            null,
            userId,
            reward.level,
            session
          );
          console.log(`✅ SmartLine transaction logged successfully for user ${reward.userId}`);
        } catch (txnError) {
          console.error(`❌ Failed to log SmartLine transaction for user ${reward.userId}:`, txnError);
          // Try again without session
          try {
            await this.logTransaction(
              reward.userId,
              'smartline_income',
              reward.amount,
              `Level ${reward.level} SmartLine Income (${(reward.rate * 100).toFixed(2)}%) from ${referrer.firstName} ${referrer.lastName} - Deposit: $${investmentAmount}`,
              'completed',
              null,
              userId,
              reward.level,
              null
            );
            console.log(`✅ SmartLine transaction logged successfully (without session) for user ${reward.userId}`);
          } catch (retryError) {
            console.error(`❌ Failed to log SmartLine transaction even without session:`, retryError);
          }
        }
      }

      console.log(`SmartLine Income distributed for investment: ${investmentAmount}`);

    } catch (error) {
      console.error('Error processing SmartLine income:', error);
    }
  }

  // Daily FS Income distribution (called by scheduler at 11:59pm IST)
  static async distributeDailyFSIncome() {
    try {
      // Find active investments (each deposit is a separate investment)
      const activeInvestments = await Investment.find({ 
        status: 'active',
        packageType: 'fs_income',
        remainingReturns: { $gt: 0 }
      }).populate('userId');

      let creditsGiven = 0;

      for (const investment of activeInvestments) {
        // Calculate daily FS Income: 6% monthly = 0.002727% daily
        const dailyAmount = investment.amount * 0.002727; // 6% monthly / 22 days
        
        if (investment.remainingReturns >= dailyAmount) {
          // Update investment remaining returns
          investment.remainingReturns -= dailyAmount;
          investment.totalReturns += dailyAmount;
          
          // Check if investment completed (reached 2x returns after 17 months)
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
            `Daily FS Income from $${investment.amount} investment (17-month lock)`,
            'completed',
            investment._id
          );

          creditsGiven++;
        }
      }

      console.log(`Daily FS Income distributed to ${creditsGiven} individual investments`);

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
        dasIncome: user.dasIncome || 0, // Actual DAS income earned from completed tasks
        walletBalance: user.walletBalance || 0, // Use direct wallet balance instead of calculated
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
        dasIncome: 0,
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