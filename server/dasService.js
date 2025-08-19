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

      // Sum total investment volume
      const investments = await Investment.find({ userId });
      const totalVolume = investments.reduce((sum, inv) => sum + inv.amount, 0);

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

  // Update task completion
  static async updateTaskCompletion(userId, taskNumber) {
    try {
      const tasks = this.getDasTasks();
      const task = tasks.find(t => t.taskNumber === taskNumber);
      
      if (!task) {
        return false;
      }

      const actualStats = await this.getUserActualStats(userId);
      const isReferralComplete = actualStats.referralCount >= task.requiredReferrals;
      const isVolumeComplete = actualStats.totalVolume >= task.requiredVolume;

      if (isReferralComplete && isVolumeComplete) {
        const updateFields = {};
        const now = new Date();
        
        if (taskNumber === 1) {
          updateFields.dasTask1Completed = true;
          updateFields.dasTask1CompletedAt = now;
        } else if (taskNumber === 2) {
          updateFields.dasTask2Completed = true;
          updateFields.dasTask2CompletedAt = now;
        } else if (taskNumber === 3) {
          updateFields.dasTask3Completed = true;
          updateFields.dasTask3CompletedAt = now;
        }

        // Update monthly earnings
        const currentUser = await User.findById(userId);
        updateFields.dasMonthlyEarnings = (currentUser.dasMonthlyEarnings || 0) + task.monthlyReward;

        await User.findByIdAndUpdate(userId, updateFields);
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

  // Check and update all task completions for a user
  static async checkAndUpdateAllTasks(userId) {
    try {
      const tasks = this.getDasTasks();
      
      for (const task of tasks) {
        await this.updateTaskCompletion(userId, task.taskNumber);
      }
    } catch (error) {
      console.error('Error checking task completions:', error);
    }
  }
}