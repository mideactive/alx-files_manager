import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient({ host: 'localhost', port: 6379 });

    // Handle errors
    this.client.on('error', (error) => {
      console.error(`Redis client not connected to server: ${error}`);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    if (!this.isAlive()) {
      console.error('Redis client is not connected');
      return null;
    }

    const getAsync = promisify(this.client.get).bind(this.client);
    const value = await getAsync(key);
    return value;
  }

  async set(key, value, duration) {
    if (!this.isAlive()) {
      console.error('Redis client is not connected');
      return;
    }

    const setAsync = promisify(this.client.set).bind(this.client);
    await setAsync(key, value);
    if (duration) {
      this.client.expire(key, duration);
    }
  }

  async del(key) {
    if (!this.isAlive()) {
      console.error('Redis client is not connected');
      return;
    }

    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }

  close() {
    // Gracefully close the Redis connection
    this.client.quit((err) => {
      if (err) {
        console.error(`Error closing Redis connection: ${err}`);
      } else {
        console.log('Redis connection closed');
      }
    });
  }
}

const redisClient = new RedisClient();

export default redisClient;
