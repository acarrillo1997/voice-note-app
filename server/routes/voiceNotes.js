const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { transcribeVoiceNote } = require('../utils/transcription');
const { generateBusinessPlan } = require('../utils/businessPlan');
const { createPage } = require('../utils/notion');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Upload voice note, transcribe, generate business plan, and store in Notion
router.post('/upload', upload.single('voiceNote'), async (req, res) => {
  try {
    const transcription = await transcribeVoiceNote(req.file.path);
    console.log('Transcription:', transcription);

    const { businessPlan, businessName } = await generateBusinessPlan(transcription);
    console.log('Generated Business Plan:', JSON.stringify(businessPlan, null, 2));
    console.log('Extracted Business Name:', businessName);

    if (!businessName || !businessPlan) {
      throw new Error('Failed to generate business plan or extract business name');
    }

    const notionResponse = await createPage(process.env.NOTION_DATABASE_ID, businessName, businessPlan);
    console.log('Notion page created successfully:', notionResponse);

    res.send({
      message: 'Voice note uploaded, transcribed, business plan generated, and stored in Notion successfully',
      transcription,
      businessPlan
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send({ error: err.message, details: err });
  }
});

module.exports = router;
