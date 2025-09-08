// Load environment variables FIRST
require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
const server = app.listen(PORT, () => {
  console.log(`
DesignSight Backend Server Started
Port: ${PORT} Environment: ${NODE_ENV}
API URL: http://localhost:${PORT} `);
});

