require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./config/supabase');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1); // Trust first proxy (important for rate limiting behind a proxy)

// Apply rate limiting
app.use('/api', generalLimiter);

// API Routes
app.use('/api', require('./routes'));

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Secure Vault API is running...');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
});
