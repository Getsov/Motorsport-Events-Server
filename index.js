const express = require('express');
const app = express();
// TODO: Add aditional libraties, middlewares!


app.get('/', (req, res) => {
    res.json({message: 'Service operational'});
    res.end();
});



async function startServer() {
    // TODO: USE aditional libraties, middlewares!
    app.listen('3030', () => console.log('Server operational on port: 3030!'));
}