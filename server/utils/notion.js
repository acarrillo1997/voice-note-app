const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const createPage = async (databaseId, title, contentBlocks) => {
  const body = {
    parent: { database_id: databaseId },
    properties: {
      title: {
        title: [
          {
            text: { content: title }
          }
        ]
      }
    },
    children: contentBlocks
  };

  try {
    const response = await notion.pages.create(body);
    console.log('Notion page created successfully:', response);
    return response;
  } catch (error) {
    console.error('Error creating Notion page:', error);
    throw error;
  }
};

module.exports = { createPage };
