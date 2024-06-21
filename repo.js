// userActionsRepository.js

const { client } = require('./dbconnect');

async function recordUserAction(userId, action, details) {
  try {
    const result = await client.query('INSERT INTO user_actions(user_id, action, details) VALUES($1, $2, $3)', [userId, action, JSON.stringify(details)]);
    console.log(`User action with id : ${userId} recorded`);
    return result;
  } catch (error) {
    console.error('Error recording user action:', error.message);
    throw error;
  }
}

async function getUserActions(userId, limit, offset) {
  try {
    const result = await client.query('SELECT * FROM user_actions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [userId, limit, offset]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching user actions:', error.message);
    throw error;
  }
}

module.exports = {
  recordUserAction,
  getUserActions,
};
