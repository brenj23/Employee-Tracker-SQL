const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'employee_tracker',
  password: 'Julian@1023',
  port: 5432,
});




module.exports = pool;
