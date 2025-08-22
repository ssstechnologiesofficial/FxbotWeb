import cron from 'node-cron';
import { InvestmentService } from './investmentService.js';

export class SchedulerService {
  static start() {
    console.log('Starting scheduler service...');
    
    // Schedule daily FS Income distribution at 11:59 PM IST (6:29 PM UTC when IST is UTC+5:30)
    // Cron format: minute hour day month day-of-week
    // 11:59 PM IST = 6:29 PM UTC (in winter) or 5:29 PM UTC (in summer)
    // Using IST timezone directly
    cron.schedule('59 23 * * *', async () => {
      console.log('Running daily FS Income distribution at 11:59 PM IST');
      try {
        await InvestmentService.distributeDailyFSIncome();
        console.log('Daily FS Income distribution completed successfully');
      } catch (error) {
        console.error('Error in scheduled FS Income distribution:', error);
      }
    }, {
      scheduled: true,
      timezone: 'Asia/Kolkata' // IST timezone
    });

    console.log('Daily FS Income scheduler set for 11:59 PM IST');
  }

  // Manual trigger for testing
  static async triggerManual() {
    console.log('Manual trigger: Running FS Income distribution...');
    try {
      await InvestmentService.distributeDailyFSIncome();
      console.log('Manual FS Income distribution completed successfully');
      return { success: true, message: 'FS Income distribution completed' };
    } catch (error) {
      console.error('Error in manual FS Income distribution:', error);
      return { success: false, error: error.message };
    }
  }
}