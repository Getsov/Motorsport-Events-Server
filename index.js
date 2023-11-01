const express = require('express');
const app = express();
const cors = require('./src/middlewares/cors');
const dbConnectionString = 'mongodb://127.0.0.1:27017/Race-Fanatic-DB';
const { mongoose } = require("mongoose");
const router = require('./src/routes');


// TODO: Add aditional libraties, middlewares!

mongoose.set('strictQuery', true);

const initializeDatabase = () => mongoose.connect(dbConnectionString)
    .then(() => {
        console.log('Database connected!');
    })
    .catch(() => {
        console.log('Database connection FAILED!');
    });


async function startServer() {
    initializeDatabase();
    // TODO: USE aditional libraties, middlewares!
    // app.use(cors);
    app.use(router);
    app.listen('3030', () => console.log('Server operational on port: 3030!'));
};
startServer();