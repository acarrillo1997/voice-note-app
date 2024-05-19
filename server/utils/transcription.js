const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const transcribeVoiceNote = async (filePath) => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('model', 'whisper-1');

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders()
      }
    });

    return response.data.text;
  } catch (error) {
    console.error('Error transcribing voice note:', error);
    throw error;
  }
};

module.exports = { transcribeVoiceNote };
