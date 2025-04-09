const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());

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


app.post('/auth/token', cors(corsOptionsDelegate), (req, res) => {
    const accessPayload = {
        client: 'dashboard-client',
        type: 'access'
    }
    // access token
    const accessToken = jwt.sign(accessPayload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
    
    const refreshPayload = {
        client: 'dashboard-client',
        type: 'refresh'
    }
    const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});
})