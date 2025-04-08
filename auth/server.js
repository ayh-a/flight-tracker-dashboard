const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json())

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

const allowedOrigins = ['http://localhost', 'http://localhost:5173'];

let corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (allowedOrigins.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {origin: true}
    } else {
        corsOptions = {origin: false}
    }
    callback(null, corsOptions)
}