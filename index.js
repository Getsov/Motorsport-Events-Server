const express = require('express');
const app = express();
const { mongoose } = require("mongoose");
const dbConnectionString = 'mongodb://127.0.0.1:27017/Race-Fanatic-DB';
// TODO: Add aditional libraties, middlewares!

mongoose.set('strictQuery', true);

const initializeDatabase = () => mongoose.connect(dbConnectionString)
    .then(() => {
        console.log('Database connect!');
    })
    .catch(() => {
        console.log('Database connection FAILED!');
    });


app.get('/', (req, res) => {
    res.json({ message: 'Service operational' });
});


async function startServer() {
    // TODO: USE aditional libraties, middlewares!
    initializeDatabase()
    app.listen('3030', () => console.log('Server operational on port: 3030!'));
};
startServer();