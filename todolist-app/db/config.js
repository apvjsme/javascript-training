const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todoapp',
  password: 'postgres123',
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
      console.error('cannot connect:', err.stack);
  } else {
      console.log('Connected!', res.rows[0]);
  }
});

module.exports = pool;
