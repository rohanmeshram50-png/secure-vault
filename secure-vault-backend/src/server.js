const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ SIMPLE & SAFE CORS (THIS IS ENOUGH)
app.use(cors());

// ✅ BODY PARSER
app.use(express.json());

// ✅ ROUTES
app.use('/api', require('./routes/index'));

// ✅ TEST ROUTE
app.get('/', (req, res) => {
  res.send('API running...');
});

// ✅ SERVER START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
