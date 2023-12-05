import { promisify } from 'util';
import redis from 'redis';

/**
 * Represents a Redis client.
 */
class RedisClient {
  /**
   * Creates a new RedisClient instance.
   */
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
    });
  }

  /**
   * Checks if this client's connection to the Redis server is active.
   * @returns {boolean}
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Retrieves the value of a given key.
   * @param {String} key The key of the item to retrieve.
   * @returns {String | Object}
   */
  async get(key) {
    // Check if the client is connected before performing the operation
    if (!this.isAlive()) {
      throw new Error('Redis client is not connected');
    }

    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key and its value along with an expiration time.
   * @param {String} key The key of the item to store.
   * @param {String | Number | Boolean} value The item to store.
   * @param {Number} duration The expiration time of the item in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    // Check if the client is connected before performing the operation
    if (!this.isAlive()) {
      throw new Error('Redis client is not connected');
    }

    await promisify(this.client.SETEX).bind(this.client)(key, duration, value);
  }

  /**
   * Removes the value of a given key.
   * @param {String} key The key of the item to remove.
   * @returns {Promise<void>}
   */
  async del(key) {
    // Check if the client is connected before performing the operation
    if (!this.isAlive()) {
      throw new Error('Redis client is not connected');
    }

    await promisify(this.client.DEL).bind(this.client)(key);
  }

  /**
   * Closes the Redis client.
   */
  close() {
    this.client.quit();
  }
}

// Export a single instance of the RedisClient
const redisClient = new RedisClient();
export default redisClient;
