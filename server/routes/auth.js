const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const emailExists = await User.findOne({ where: { email } });
  if (emailExists) return res.status(400).send('Email already exists');

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const user = new User({
    username,
    email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.send({ user: savedUser.id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login request received for email:', email);

  // Check if email exists
  const user = await User.findOne({ where: { email } });
  if (!user) {
    console.log('Email not found');
    return res.status(400).send('Email or password is wrong');
  }

  // Check password
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    console.log('Invalid password');
    return res.status(400).send('Invalid password');
  }

  // Create and assign a token
  const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
  res.header('Authorization', token).send(token);
});

module.exports = router;

console.log('TOKEN_SECRET:', process.env.TOKEN_SECRET);

