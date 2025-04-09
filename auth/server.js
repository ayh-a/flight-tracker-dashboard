const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const tokenStorage = require('./tokenStorage');


app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

const allowedOrigins = ['http://localhost', 'http://localhost:5173', 'http://localhost:80', 'http://frontend'];
const tokens = tokenStorage.initialize(process.env.JWT_ACCESS_SECRET);

let corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (allowedOrigins.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true,
            credentials: true,
            methods: ['GET', 'POST', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }
    } else {
        corsOptions = {origin: false}
    }
    callback(null, corsOptions)
}

const validateToken = (req, res, next) => {
    const token = req.cookies.access_token;
    
    if (!token) {
      return res.status(401).json({ message: 'Access token not found' });
    }
    
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.clientData = payload;
      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }
  };

  const rateLimit = require('express-rate-limit');

// limiter for the auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again after 15 minutes'
});

app.use('/auth', authLimiter);


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
  
    tokens.addToken(refreshToken);
    res.status(200).json({ message: 'Authentication successful' });
});

app.post('/auth/refresh', cors(corsOptionsDelegate), (req, res) => {
    const refreshToken = req.cookies.refresh_token;
   
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }
   
    if (!tokens.hasToken(refreshToken)) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
   
    // verify token
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      tokens.removeToken(refreshToken);
      
      const accessToken = jwt.sign(
        { client: payload.client, type: 'access' },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );
      
      const newRefreshToken = jwt.sign(
        { client: payload.client, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );
      
      // store new refresh token
      tokens.addToken(newRefreshToken);
     
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
        tokens.removeToken(refreshToken);
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
});

app.post('/auth/revoke', cors(corsOptionsDelegate), (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    if (refreshToken) {
        tokens.removeToken(refreshToken);
      }
    
    if (!refreshToken) {
      return res.status(200).json({ message: 'No token to revoke' });
    }
    
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    return res.status(200).json({ message: 'Tokens revoked successfully' });
  });


  /**
   * Test endpoint
   */
  app.get('/auth/protected', validateToken, (req, res) => {
    res.json({ 
      message: 'You accessed a protected route', 
      client: req.clientData.client 
    });
  });