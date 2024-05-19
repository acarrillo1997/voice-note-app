const axios = require('axios');

const generateBusinessPlan = async (transcription) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a professional business plan generator.' },
        { role: 'user', content: `Generate a professional business plan based on the following transcription: "${transcription}". Suggest a name for the business plan and provide the detailed plan.` }
      ],
      max_tokens: 1000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const businessPlan = response.data.choices[0].message.content.trim();

    // Extract business name from the first line of the business plan
    const businessNameMatch = businessPlan.match(/Business Plan Name: (.*)/);
    const businessName = businessNameMatch ? businessNameMatch[1] : 'Untitled Business Plan';

    return { businessPlan, businessName };
  } catch (error) {
    console.error('Error generating business plan:', error);
    throw error;
  }
};

module.exports = { generateBusinessPlan };
