require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const authRoute = require('./routes/auth');
const voiceNoteRoute = require('./routes/voiceNotes');
const path = require('path');

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// Route Middleware
app.use('/api/user', authRoute);
app.use('/api/voiceNotes', voiceNoteRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
