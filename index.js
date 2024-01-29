const express = require('express');
const app = express();
const cors = require('./src/middlewares/cors');
const { mongoose } = require('mongoose');
const session = require('./src/middlewares/session');
const router = require('./src/routes');
mongoose.set('strictQuery', true);
require('dotenv').config();

const dbConnectionString = process.env.MONGO_URI;
const initializeDatabase = () =>
  mongoose
    .connect(dbConnectionString)
    .then(() => {
      console.log('Database connected!');
    })
    .catch((err) => {
      console.log(err);
      console.log('Database connection FAILED!');
    });

async function startServer() {
  initializeDatabase();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  app.use(session());
  app.use(router);
  app.listen('3030', () => console.log('Server operational on port: 3030!'));
}
startServer();
