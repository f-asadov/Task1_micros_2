const express = require('express');
const bodyParser = require('body-parser');
const { KafkaClient, Consumer } = require('kafka-node');
const { connect, createTable } = require('./dbconnect');
const userActionsRepository = require('./repo');

require('dotenv').config();

const app = express();
const USER_CREATED_TOPIC = 'user_created';
const USER_UPDATED_TOPIC = 'user_updated';
app.use(bodyParser.json());

connect()
  .then(createTable)
  .catch((error) => {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  });

const kafkaClient = new KafkaClient({ kafkaHost: `localhost:${process.env.KAFKA_PORT}` });
const consumer = new Consumer(kafkaClient, [{ topic: USER_CREATED_TOPIC }, { topic: USER_UPDATED_TOPIC }], { autoCommit: true });

consumer.on('message', async (message) => {
  const user = JSON.parse(message.value).userInfo;

  try {
    await userActionsRepository.recordUserAction(user.id, message.topic, JSON.parse(message.value));
  } catch (error) {
    console.error('Error processing Kafka message:', error.message);
  }
});

app.get('/history', async (req, res) => {
  const { userId, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const userActions = await userActionsRepository.getUserActions(userId, limit, offset);
    res.json(userActions);
  } catch (error) {
    console.error('Error fetching user actions:', error.message);
    res.status(500).json({ error: 'Failed to fetch user actions' });
  }
});

app.listen(+process.env.APP_PORT, () => {
  console.log(`History service listening on port ${process.env.APP_PORT}`);
});
