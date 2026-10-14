const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');

async function start() {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_ORIGIN'];
  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exitCode = 1;
    return;
  }
  const app = express();
  app.use(express.json({ limit: '100kb' }));
  const allowedOrigins = process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim());
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/api/auth', require('./routes/auth'));
  app.get('/', (req, res) => res.send('Hello World!'));
  try {
    await connectToMongo();
    console.log('Connected to Mongo Successfully');
    const port = process.env.PORT || 8181;
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch {
    // Database errors can include connection credentials. Never log them.
    console.error('Unable to connect to MongoDB. Check the database service and local configuration.');
    process.exitCode = 1;
  }
}
start();
