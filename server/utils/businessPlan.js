const axios = require('axios');

const generateBusinessPlan = async (transcription) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a professional business plan generator. Make sure that all the data you return is formatted so it can be used to create a notion page.' },
        { role: 'user', content: `Generate a professional business plan based on the following transcription: "${transcription}"` }
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

    // Log the non-formatted output from OpenAI
    console.log('Non-formatted business plan output:', businessPlan);

    // Extract business name from the first line of the business plan
    const firstLine = businessPlan.split('\n')[0];
    const businessName = firstLine.startsWith('# ') ? firstLine.replace('# ', '') : firstLine;

    // Convert Markdown to Notion rich text format
    const convertMarkdownToNotionBlocks = (text) => {
      const lines = text.split('\n');
      const blocks = [];

      lines.forEach(line => {
        if (line.startsWith('# ')) {
          blocks.push({
            object: 'block',
            type: 'heading_1',
            heading_1: {
              rich_text: [{ type: 'text', text: { content: line.replace('# ', '') } }],
            },
          });
        } else if (line.startsWith('## ')) {
          blocks.push({
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [{ type: 'text', text: { content: line.replace('## ', '') } }],
            },
          });
        } else if (line.startsWith('### ')) {
          blocks.push({
            object: 'block',
            type: 'heading_3',
            heading_3: {
              rich_text: [{ type: 'text', text: { content: line.replace('### ', '') } }],
            },
          });
        } else if (line.trim() !== '') {
          blocks.push({
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ type: 'text', text: { content: line.replace(/\*\*/g, '') } }],
            },
          });
        }
      });

      return blocks;
    };

    const richTextBusinessPlan = convertMarkdownToNotionBlocks(businessPlan);

    // Log the formatted business plan
    console.log('Formatted business plan:', JSON.stringify(richTextBusinessPlan, null, 2));

    return { businessPlan: richTextBusinessPlan, businessName };
  } catch (error) {
    console.error('Error generating business plan:', error);
    throw error;
  }
};

module.exports = { generateBusinessPlan };
