const redis = require('redis');

// Create a new Redis client and connect to the Redis server
const client = redis.createClient({
  host: 'localhost',
  port: 6379,        // Redis port (default is 6379)
  // Optionally set Redis password here if your Redis instance is password protected
  // password: 'your-redis-password',
});

// Handle Redis connection errors
client.on('error', (err) => {
  console.log('Redis error: ', err);
});

module.exports = client;