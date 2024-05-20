const { Client } = require('pg');
const client = new Client({
  user: 'your_username',
  host: 'localhost',
  database: 'employee_tracker',
  password: 'your_password',
  port: 3001,
});

client.connect();

module.exports = client;
