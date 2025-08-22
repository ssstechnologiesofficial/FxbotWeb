import { User, Investment } from './database.js';

export class DasService {
  // DAS task definitions
  static getDasTasks() {
    return [
      {
        taskNumber: 1,
        requiredReferrals: 5,
        requiredVolume: 10000,
        requiredDays: 30,
        monthlyReward: 100
      },
      {
        taskNumber: 2,
        requiredReferrals: 10,
        requiredVolume: 20000,
        requiredDays: 60,
        monthlyReward: 300
      },
      {
        taskNumber: 3,
        requiredReferrals: 15,
        requiredVolume: 50000,
        requiredDays: 90,
        monthlyReward: 1000
      }
    ];
  }

  // Enroll user in DAS program
  static async enrollUserInDas(userId) {
    try {
      const now = new Date();
      
      const result = await User.findByIdAndUpdate(userId, {
        isEnrolledInDas: true,
        dasEnrollmentDate: now,
        dasCountdownStartDate: now
      }, { new: true });

      if (result) {
        console.log(`User ${userId} enrolled in DAS program successfully`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error enrolling user in DAS:', error);
      return false;
    }
  }

  // Get DAS countdown information for a user
  static async getDasCountdown(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user || !user.isEnrolledInDas) {
        return { isEnrolled: false };
      }

      const startDate = new Date(user.dasCountdownStartDate);
      const now = new Date();
      const maxDays = 90;
      
      // Calculate days elapsed and remaining
      const daysElapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, maxDays - daysElapsed);
      
      // Get user's current progress
      const progress = await this.getUserDasProgress(userId);
      
      return {
        isEnrolled: true,
        startDate: startDate.toISOString(),
        daysElapsed,
        daysRemaining,
        totalDays: maxDays,
        progress
      };
    } catch (error) {
      console.error('Error getting DAS countdown:', error);
      return { isEnrolled: false, error: 'Failed to fetch countdown data' };
    }
  }

  // Get user's progress on all DAS tasks
  static async getUserDasProgress(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return [];

      const tasks = this.getDasTasks();
      const actualStats = await this.getUserActualStats(userId);

      // Calculate progress for each task
      const progressData = tasks.map(task => {
        const referralProgress = (actualStats.referralCount / task.requiredReferrals) * 100;
        const volumeProgress = (actualStats.totalVolume / task.requiredVolume) * 100;
        
        const isReferralComplete = actualStats.referralCount >= task.requiredReferrals;
        const isVolumeComplete = actualStats.totalVolume >= task.requiredVolume;
        
        let isCompleted = false;
        let completedAt = null;
        
        if (task.taskNumber === 1) {
          isCompleted = user.dasTask1Completed;
          completedAt = user.dasTask1CompletedAt;
        } else if (task.taskNumber === 2) {
          isCompleted = user.dasTask2Completed;
          completedAt = user.dasTask2CompletedAt;
        } else if (task.taskNumber === 3) {
          isCompleted = user.dasTask3Completed;
          completedAt = user.dasTask3CompletedAt;
        }
        
        return {
          taskNumber: task.taskNumber,
          requirements: {
            referrals: task.requiredReferrals,
            volume: task.requiredVolume,
            days: task.requiredDays
          },
          current: {
            referrals: actualStats.referralCount,
            volume: actualStats.totalVolume,
            referralProgress: Math.min(100, referralProgress),
            volumeProgress: Math.min(100, volumeProgress)
          },
          monthlyReward: task.monthlyReward,
          isCompleted: isCompleted || false,
          completedAt: completedAt,
          canComplete: isReferralComplete && isVolumeComplete && !isCompleted
        };
      });

      return progressData;
    } catch (error) {
      console.error('Error getting user DAS progress:', error);
      return [];
    }
  }

  // Get user's actual referral count and volume
  static async getUserActualStats(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { referralCount: 0, totalVolume: 0 };
      }

      // Count direct referrals (children)
      const referralCount = user.children.length;

      // Sum total investment volume from referrals (children), not user's own deposits
      let totalVolume = 0;
      if (user.children.length > 0) {
        const childrenInvestments = await Investment.find({ 
          userId: { $in: user.children },
          status: 'active' 
        });
        totalVolume = childrenInvestments.reduce((sum, inv) => sum + inv.amount, 0);
      }

      return {
        referralCount,
        totalVolume: totalVolume || 0
      };
    } catch (error) {
      console.error('Error getting user actual stats:', error);
      return {
        referralCount: 0,
        totalVolume: 0
      };
    }
  }

  // Update task completion with time-based expiry and wallet crediting
  static async updateTaskCompletion(userId, taskNumber) {
    try {
      const tasks = this.getDasTasks();
      const task = tasks.find(t => t.taskNumber === taskNumber);
      
      if (!task) {
        return false;
      }

      const user = await User.findById(userId);
      if (!user || !user.isEnrolledInDas) {
        return false;
      }

      // Check if task is already completed
      const completedField = `dasTask${taskNumber}Completed`;
      if (user[completedField]) {
        return false; // Already completed
      }

      // Check if task has expired based on enrollment date
      const enrollmentDate = new Date(user.dasEnrollmentDate);
      const currentDate = new Date();
      const daysSinceEnrollment = Math.floor((currentDate - enrollmentDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceEnrollment > task.requiredDays) {
        // Task has expired - mark as expired if not already done
        const expiredField = `dasTask${taskNumber}Expired`;
        if (!user[expiredField]) {
          const updateFields = { [expiredField]: true };
          await User.findByIdAndUpdate(userId, updateFields);
        }
        return false;
      }

      // Check if requirements are met
      const actualStats = await this.getUserActualStats(userId);
      const isReferralComplete = actualStats.referralCount >= task.requiredReferrals;
      const isVolumeComplete = actualStats.totalVolume >= task.requiredVolume;

      if (isReferralComplete && isVolumeComplete) {
        const updateFields = {};
        const now = new Date();
        
        // Mark task as completed
        updateFields[`dasTask${taskNumber}Completed`] = true;
        updateFields[`dasTask${taskNumber}CompletedAt`] = now;

        // Credit DAS income to wallet balance immediately
        updateFields.dasIncome = (user.dasIncome || 0) + task.monthlyReward;
        updateFields.walletBalance = (user.walletBalance || 0) + task.monthlyReward;

        await User.findByIdAndUpdate(userId, updateFields);

        // Create DAS income transaction
        const { InvestmentService } = await import('./investmentService.js');
        await InvestmentService.logTransaction(
          userId,
          'das_income',
          task.monthlyReward,
          `DAS Task ${taskNumber} Completed - ${task.requiredReferrals} referrals & $${task.requiredVolume} volume in ${task.requiredDays} days`,
          'completed'
        );

        console.log(`DAS Task ${taskNumber} completed for user ${userId} - $${task.monthlyReward} credited`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating task completion:', error);
      return false;
    }
  }

  // Add investment volume
  static async addInvestment(userId, amount, packageType = 'standard') {
    try {
      const investment = new Investment({
        userId,
        amount,
        packageType,
        status: 'active'
      });

      await investment.save();

      // Update user's total investment volume
      await User.findByIdAndUpdate(userId, {
        $inc: { totalInvestmentVolume: amount }
      });

      // Check and update task completions
      await this.checkAndUpdateAllTasks(userId);

      return true;
    } catch (error) {
      console.error('Error adding investment:', error);
      return false;
    }
  }

  // Check and update all task completions for a user (auto-completion)
  static async checkAndUpdateAllTasks(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.isEnrolledInDas) {
        return false;
      }

      const tasks = this.getDasTasks();
      let tasksUpdated = 0;
      
      for (const task of tasks) {
        const completedField = `dasTask${task.taskNumber}Completed`;
        const expiredField = `dasTask${task.taskNumber}Expired`;
        
        // Skip if already completed or expired
        if (user[completedField] || user[expiredField]) {
          continue;
        }

        // Check if task should be auto-completed
        const wasCompleted = await this.updateTaskCompletion(userId, task.taskNumber);
        if (wasCompleted) {
          tasksUpdated++;
        }
      }
      
      if (tasksUpdated > 0) {
        console.log(`Auto-completed ${tasksUpdated} DAS tasks for user ${userId}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error checking and updating all tasks:', error);
      return false;
    }
  }
}