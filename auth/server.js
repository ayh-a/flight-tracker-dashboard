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

let refreshTokens = [];

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
    // refresh token
    const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});

    // Set access token as cookie
    res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 min
  });
  
    // Set refresh token as cookie
    res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  
    res.status(200).json({ message: 'Authentication successful' });
    refreshTokens.push(refreshToken);
});

app.post('/auth/refresh', cors(corsOptionsDelegate), (req, res) => {
    const refreshToken = req.cookies.refresh_token;
   
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }
   
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
   
    // verify token
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
     
      // Remove the old refresh token
      refreshTokens = refreshTokens.filter(token => token !== refreshToken);
      
      // Generate new access token
      const accessToken = jwt.sign(
        { client: payload.client, type: 'access' },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );
      
      // Generate new refresh token (rotation)
      const newRefreshToken = jwt.sign(
        { client: payload.client, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );
      
      // Store the new refresh token
      refreshTokens.push(newRefreshToken);
     
      // Set new tokens as cookies
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });
      
      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
     
      return res.status(200).json({ message: 'Tokens refreshed successfully' });
    } catch (error) {
      refreshTokens = refreshTokens.filter(token => token !== refreshToken);
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
});

app.post('/auth/revoke', cors(corsOptionsDelegate), (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    
    if (!refreshToken) {
      return res.status(200).json({ message: 'No token to revoke' });
    }
    
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    return res.status(200).json({ message: 'Tokens revoked successfully' });
  });