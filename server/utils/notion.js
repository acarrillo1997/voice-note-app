const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Helper function to split text into chunks
const splitTextIntoChunks = (text, maxLength) => {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.substring(start, start + maxLength));
    start += maxLength;
  }
  return chunks;
};

const createPage = async (databaseId, title, transcription, businessPlan) => {
  try {
    const transcriptionChunks = splitTextIntoChunks(transcription, 2000);
    const businessPlanChunks = splitTextIntoChunks(businessPlan, 2000);

    const children = [
      ...transcriptionChunks.map(chunk => ({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: chunk,
              },
            },
          ],
        },
      })),
      ...businessPlanChunks.map(chunk => ({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: chunk,
              },
            },
          ],
        },
      }))
    ];

    console.log(`Using database ID: ${databaseId}`);

    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
      children,
    });
  } catch (error) {
    console.error('Error creating Notion page:', error);
    throw error;
  }
};

module.exports = { createPage };
