const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: '159.8.122.144',
      user: 'boopugbb_render',
      password: 'Database@@2026',
      database: 'boopugbb_render',
      connectTimeout: 10000
    });
    console.log('✅ Connection to database successful!');
    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
