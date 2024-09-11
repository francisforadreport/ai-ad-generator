const express = require('express');
const router = express.Router();
const { generateHeadlines, generateDescriptions, extractKeywords } = require('../services/openai');

router.post('/generate', async (req, res) => {
  try {
    const { url, keywords, tone } = req.body;
    const headlines = await generateHeadlines(url, keywords, tone);
    const descriptions = await generateDescriptions(url, keywords, tone);
    res.json({ headlines, descriptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while generating ad content' });
  }
});

router.post('/extract-keywords', async (req, res) => {
  try {
    const { url } = req.body;
    const keywords = await extractKeywords(url);
    res.json({ keywords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while extracting keywords' });
  }
});

module.exports = router;
