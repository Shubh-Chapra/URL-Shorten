require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
// const Redis = require('ioredis');
const { swaggerUi, specs } = require('./config/swagger');

const PORT = process.env.PORT || 8080;
app.use(express.json());

 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
 app.use(cors());

const connectDB = require('./config/database');
const redisClient = require('./config/redisClient');

const urlRoutes = require('./routes/urlRoutes');
const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes'); 

const errorHandler = require('./middleware/errorHandler');

connectDB();

app.use('/api/shorten', urlRoutes);
app.use('/urls' , urlRoutes);
app.use('/test', testRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes); 
const appRoutes = require('./routes/appRoutes'); 
app.use('/api/app', appRoutes); 


//app.use(errqorHandler);

//Healthcheck endpoint
app.get('/health', async (req, res) => {
  const healthStatus = {
    "Express Server": 'UP',
    database: 'DOWN',
    cache: 'DOWN',
    timestamp: new Date().toISOString()
  };

  try {
    await mongoose.connection.db.collection('healthchecks').findOne({});
    healthStatus.database = 'UP';
  } catch (dbErr) {
    console.error('Health check: MongoDB connection failed:', dbErr);
    healthStatus.database = 'DOWN';
  }

  try {
    await redisClient.ping(); 
    await redisClient.set('healthcheck_key', 'ok', 'EX', 10); 
    const testValue = await redisClient.get('healthcheck_key'); 
    if (testValue === 'ok') {
      healthStatus.cache = 'UP';
    } else {
      healthStatus.cache = 'DOWN';
    }
  } catch (redisErr) {
    console.error('Health check: Redis connection failed:', redisErr);
    healthStatus.cache = 'DOWN';
  }

  if (healthStatus.database === 'UP' && healthStatus.cache === 'UP') {
    res.status(200).json(healthStatus);
  } else {
    res.status(500).json(healthStatus);
  }
});


  app.get('/', (req, res) => {
    res.send('API is up and running!');
  });

  //Global error handler
  app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

module.exports = app;

 
    