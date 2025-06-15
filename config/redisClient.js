const Redis = require('ioredis');
const redisClient = new Redis(process.env.REDIS_URI);

redisClient.on('connect', () => console.log('Redis connected Successfully'));
redisClient.on('error', (err) => console.error('Redis error:', err));

module.exports = redisClient;
