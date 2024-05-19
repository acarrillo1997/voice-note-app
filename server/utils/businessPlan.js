const axios = require('axios');

const generateBusinessPlan = async (transcription) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/generate-business-plan', {
      text: transcription,
      api_key: process.env.GPT_API_KEY
    });
    return response.data.business_plan;
  } catch (error) {
    console.error('Error generating business plan:', error);
    throw error;
  }
};

module.exports = { generateBusinessPlan };
