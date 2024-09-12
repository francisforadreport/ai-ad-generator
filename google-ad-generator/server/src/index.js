require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5001;

// Enable CORS for all routes
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use(express.json());

const adGeneratorRouter = require('./routes/adGenerator');

app.use('/api/ad-generator', adGeneratorRouter);

app.get('/', (req, res) => {
  res.send('Google Ad Generator API');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
