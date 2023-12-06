// controllers/AppController.js

import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static async getStatus(request, response) {
    try {
      const redisStatus = await redisClient.isAlive();
      const dbStatus = await dbClient.isAlive();

      return response.status(200).json({ redis: redisStatus, db: dbStatus });
    } catch (error) {
      console.error('Error in getStatus:', error);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getStats(request, response) {
    try {
      const usersNum = await dbClient.nbUsers();
      const filesNum = await dbClient.nbFiles();

      return response.status(200).json({ users: usersNum, files: filesNum });
    } catch (error) {
      console.error('Error in getStats:', error);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AppController;
