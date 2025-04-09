const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TOKEN_STORAGE_FILE = path.join(__dirname, 'data', 'tokens.json');

if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// tokens array
let refreshTokens = [];

function initializeEncryption(secretKey) {
  const encryptionKey = crypto.createHash('sha256').update(secretKey).digest();
  const IV_LENGTH = 16;
  
  return {
    encrypt: function(text) {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return iv.toString('hex') + ':' + encrypted;
    },
    
    decrypt: function(text) {
      const parts = text.split(':');
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = parts[1];
      const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }
  };
}

module.exports = {
  initialize: function(secretKey) {
    const crypto = initializeEncryption(secretKey);
    
    // load tokens from storage
    function loadTokens() {
      try {
        if (fs.existsSync(TOKEN_STORAGE_FILE)) {
          const encryptedData = fs.readFileSync(TOKEN_STORAGE_FILE, 'utf8');
          const decryptedData = crypto.decrypt(encryptedData);
          refreshTokens = JSON.parse(decryptedData);
          console.log('Tokens loaded from secure storage');
        }
      } catch (error) {
        console.error('Error loading tokens:', error.message);
        refreshTokens = []; 
      }
    }

    // save tokens to storage
    function saveTokens() {
      try {
        // encrypt the token data before saving
        const encryptedData = crypto.encrypt(JSON.stringify(refreshTokens));
        fs.writeFileSync(TOKEN_STORAGE_FILE, encryptedData, 'utf8');
      } catch (error) {
        console.error('Error saving tokens:', error.message);
      }
    }
    
    loadTokens();
    
    return {
      getTokens: () => [...refreshTokens],
      addToken: (token) => {
        refreshTokens.push(token);
        saveTokens();
      },
      removeToken: (token) => {
        refreshTokens = refreshTokens.filter(t => t !== token);
        saveTokens();
      },
      hasToken: (token) => refreshTokens.includes(token)
    };
  }
};