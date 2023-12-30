const express = require('express');
const app = express();
const cors = require('./src/middlewares/cors');
const dbConnectionString = 'mongodb://127.0.0.1:27017/Race-Fanatic-DB';
const { mongoose } = require('mongoose');
const session = require('./src/middlewares/session');
const router = require('./src/routes');
const trimBoddy = require('./src/middlewares/trimBoddy');
mongoose.set('strictQuery', true);
require("dotenv").config();

const initializeDatabase = () =>
    mongoose
        .connect(dbConnectionString)
        .then(() => {
            console.log('Database connected!');
        })
        .catch(() => {
            console.log('Database connection FAILED!');
        });

async function startServer() {
    initializeDatabase();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(session());
    // TODO: Check about trim Body is viable solution?
    // app.use(trimBoddy());
    app.use(router);
    app.listen('3030', () => console.log('Server operational on port: 3030!'));
}
startServer();