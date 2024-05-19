const axios = require('axios');

const transcribeVoiceNote = async (filePath) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/transcriptions', {
      audio: filePath,
      api_key: process.env.GPT_API_KEY
    });
    return response.data.transcription;
  } catch (error) {
    console.error('Error transcribing voice note:', error);
    throw error;
  }
};

module.exports = { transcribeVoiceNote };
