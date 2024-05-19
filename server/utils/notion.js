const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const createPage = async (databaseId, title, transcription, businessPlan) => {
  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            text: [
              {
                type: 'text',
                text: {
                  content: transcription,
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            text: [
              {
                type: 'text',
                text: {
                  content: businessPlan,
                },
              },
            ],
          },
        },
      ],
    });
  } catch (error) {
    console.error('Error creating Notion page:', error);
    throw error;
  }
};

module.exports = { createPage };
