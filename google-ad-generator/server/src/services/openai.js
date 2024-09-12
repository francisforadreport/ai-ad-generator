const OpenAI = require("openai");
const axios = require('axios');
const cheerio = require('cheerio');

const stopWords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
  'with', 'this', 'i', 'you', 'your', 'we', 'our', 'us', 'they', 'them', 'their'
]);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractKeywords(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const headings = $('h1, h2, h3').map((i, el) => $(el).text()).get();
    const content = $('p').text();

    // Combine and process the extracted text to get keywords
    const allText = `${metaKeywords} ${metaDescription} ${headings.join(' ')} ${content}`;
    const words = allText.toLowerCase().split(/\W+/);
    const keywordCounts = {};
    
    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        keywordCounts[word] = (keywordCounts[word] || 0) + 1;
      }
    });

    const sortedKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]) => word);

    return sortedKeywords;
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return [];
  }
}

async function generateHeadlines(url, userKeywords, tone) {
  const extractedKeywords = await extractKeywords(url);
  const allKeywords = [...new Set([...userKeywords.split(','), ...extractedKeywords])].join(', ');

  const prompt = `Generate 15 unique, creative, and compelling headlines for a Google Ad. 
  URL: ${url}
  Keywords: ${allKeywords}
  Tone: ${tone}
  Maximum characters: 30`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant that generates ad headlines." },
      { role: "user", content: prompt }
    ],
    max_tokens: 200,
    n: 1,
    temperature: 0.8,
  });

  return response.choices[0].message.content.trim().split('\n').filter(line => line.trim() !== '').slice(0, 15);
}

async function generateDescriptions(url, keywords, tone) {
  const extractedKeywords = await extractKeywords(url);
  const allKeywords = [...new Set([...keywords.split(','), ...extractedKeywords])].join(', ');

  const prompt = `Generate 10 unique and compelling descriptions for a Google Ad. 
  URL: ${url}
  Keywords: ${allKeywords}
  Tone: ${tone}
  Maximum characters: 90`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant that generates ad descriptions." },
      { role: "user", content: prompt }
    ],
    max_tokens: 200,
    n: 1,
    temperature: 0.8,
  });

  return response.choices[0].message.content.trim().split('\n').filter(line => line.trim() !== '').slice(0, 10);
}

module.exports = { generateHeadlines, generateDescriptions, extractKeywords };
