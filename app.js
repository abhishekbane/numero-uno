const express = require('express');

const app = express();

const groupRoutes = require('./routes/group');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, PUT');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.use( express.json() );

app.use( groupRoutes );

const server = app.listen(3000);

const io = require('./socket').init(server);

