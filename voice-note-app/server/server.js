require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const authRoute = require('./routes/auth');

// Middleware
app.use(express.json());

// Route Middleware
app.use('/api/user', authRoute);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
