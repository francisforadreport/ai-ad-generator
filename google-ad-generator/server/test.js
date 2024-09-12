require('dotenv').config();
const { generateHeadlines, generateDescriptions } = require('./src/services/openai');

async function test() {
  try {
    const headlines = await generateHeadlines('https://example.com', 'test, keywords', 'professional');
    console.log('Headlines:', headlines);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
