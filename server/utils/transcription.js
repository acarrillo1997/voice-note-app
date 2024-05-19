const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const transcribeVoiceNote = async (filePath, retries = 3) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('model', 'whisper-1');

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          ...form.getHeaders()
        }
      });

      return response.data.text;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        if (attempt < retries) {
          console.log(`Rate limited. Retrying in ${attempt * 2} seconds...`);
          await sleep(attempt * 2000);
        } else {
          throw new Error('Max retries reached. Please try again later.');
        }
      } else {
        throw error;
      }
    }
  }
};

module.exports = { transcribeVoiceNote };
