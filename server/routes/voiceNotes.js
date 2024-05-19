const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { transcribeVoiceNote } = require('../utils/transcription');
const { generateBusinessPlan } = require('../utils/businessPlan');

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

// Upload voice note, transcribe, and generate business plan
router.post('/upload', upload.single('voiceNote'), async (req, res) => {
  try {
    const transcription = await transcribeVoiceNote(req.file.path);
    const businessPlan = await generateBusinessPlan(transcription);
    res.send({ message: 'Voice note uploaded, transcribed, and business plan generated successfully', transcription, businessPlan });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
