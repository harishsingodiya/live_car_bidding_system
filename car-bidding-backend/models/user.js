const db = require('../config/db');

const User = {
  create: async (username, password) => {
    const [result] = await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );
    return result;
  },

  getById: async (userId) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    return rows[0];
  },

  getByUsername: async (username) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  },

  getAllUsers: async () => {
    const [rows] = await db.execute('SELECT * FROM users');
    return rows;
  }
};

module.exports = User;
