import { User } from './database.js';

// Reward percentages for each level
const REWARD_RATES = {
  1: 0.015, // 1.5%
  2: 0.010, // 1.0%
  3: 0.0075, // 0.75%
  4: 0.005, // 0.50%
  5: 0.0025 // 0.25%
};

class ReferralService {
  
  // Update referral counts when a new user is registered
  async updateReferralCounts(newUserId) {
    try {
      const newUser = await User.findById(newUserId).populate('parent');
      if (!newUser || !newUser.parent) return;

      let currentParent = newUser.parent;
      let level = 1;

      // Traverse up the referral chain for 5 levels
      while (currentParent && level <= 5) {
        const updateField = `level${level}Count`;
        
        await User.findByIdAndUpdate(currentParent._id, {
          $inc: { 
            [updateField]: 1,
            referralCount: level === 1 ? 1 : 0 // Only count direct referrals in referralCount
          }
        });

        // Get the next parent
        const parentUser = await User.findById(currentParent._id).populate('parent');
        currentParent = parentUser?.parent;
        level++;
      }
    } catch (error) {
      console.error('Error updating referral counts:', error);
    }
  }

  // Calculate and distribute rewards when an investment is made
  async distributeRewards(investorId, investmentAmount) {
    try {
      const investor = await User.findById(investorId).populate('parent');
      if (!investor || !investor.parent) return;

      let currentParent = investor.parent;
      let level = 1;
      const rewards = [];

      // Traverse up the referral chain for 5 levels
      while (currentParent && level <= 5) {
        const rewardRate = REWARD_RATES[level];
        const rewardAmount = investmentAmount * rewardRate;
        
        const levelEarningsField = `level${level}Earnings`;
        
        // Update parent's earnings
        await User.findByIdAndUpdate(currentParent._id, {
          $inc: {
            [levelEarningsField]: rewardAmount,
            totalEarnings: rewardAmount
          }
        });

        rewards.push({
          userId: currentParent._id,
          level: level,
          amount: rewardAmount,
          rate: rewardRate
        });

        // Get the next parent
        const parentUser = await User.findById(currentParent._id).populate('parent');
        currentParent = parentUser?.parent;
        level++;
      }

      return rewards;
    } catch (error) {
      console.error('Error distributing rewards:', error);
      return [];
    }
  }

  // Get detailed referral statistics for a user
  async getReferralStats(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          level1Count: 0, level2Count: 0, level3Count: 0, level4Count: 0, level5Count: 0,
          totalReferrals: 0, totalEarnings: 0,
          level1Earnings: 0, level2Earnings: 0, level3Earnings: 0, level4Earnings: 0, level5Earnings: 0
        };
      }

      const stats = {
        level1Count: user.level1Count || 0,
        level2Count: user.level2Count || 0,
        level3Count: user.level3Count || 0,
        level4Count: user.level4Count || 0,
        level5Count: user.level5Count || 0,
        totalReferrals: (user.level1Count || 0) + (user.level2Count || 0) + 
                       (user.level3Count || 0) + (user.level4Count || 0) + (user.level5Count || 0),
        totalEarnings: user.totalEarnings || 0,
        level1Earnings: user.level1Earnings || 0,
        level2Earnings: user.level2Earnings || 0,
        level3Earnings: user.level3Earnings || 0,
        level4Earnings: user.level4Earnings || 0,
        level5Earnings: user.level5Earnings || 0
      };

      return stats;
    } catch (error) {
      console.error('Error getting referral stats:', error);
      return {
        level1Count: 0, level2Count: 0, level3Count: 0, level4Count: 0, level5Count: 0,
        totalReferrals: 0, totalEarnings: 0,
        level1Earnings: 0, level2Earnings: 0, level3Earnings: 0, level4Earnings: 0, level5Earnings: 0
      };
    }
  }

  // Get referral tree for a user (limited depth for performance)
  async getReferralTree(userId, maxDepth = 3) {
    try {
      const buildTree = async (parentId, currentDepth) => {
        if (currentDepth > maxDepth) return [];
        
        const children = await User.find({ parent: parentId })
          .select('firstName lastName email ownSponsorId createdAt level1Count level2Count level3Count level4Count level5Count')
          .lean();

        const tree = [];
        for (const child of children) {
          const childTree = await buildTree(child._id, currentDepth + 1);
          tree.push({
            ...child,
            children: childTree,
            level: currentDepth
          });
        }
        
        return tree;
      };

      return await buildTree(userId, 1);
    } catch (error) {
      console.error('Error getting referral tree:', error);
      return [];
    }
  }
}

export const referralService = new ReferralService();