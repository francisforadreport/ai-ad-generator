const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Enable CORS for all routes
const corsOptions = {
  origin: process.env.CLIENT_URL || 'https://ai-ad-generator-client-static-site.onrender.com/',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../client/build')));

const adGeneratorRouter = require('./routes/adGenerator');
app.use('/api/ad-generator', adGeneratorRouter);

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
