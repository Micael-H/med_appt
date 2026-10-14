const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

function tokenFor(user) {
  return jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
}
function authenticate(req, res, next) {
  const authorization = req.get('authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7) : req.get('auth-token');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (!payload.user?.id || !/^[a-f\d]{24}$/i.test(payload.user.id)) throw new Error('Invalid subject');
    req.userId = payload.user.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Authentication required' });
  }
}
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}
const nameRule = () => body('name').isString().trim().isLength({ min: 4, max: 120 });
const phoneRule = () => body('phone').isString().trim().isLength({ min: 10, max: 30 });

router.post('/register', [
  body('email').isString().trim().isEmail().isLength({ max: 254 }),
  nameRule(), phoneRule(),
  body('password').isString().isLength({ min: 8, max: 72 }),
], validate, async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    if (await User.findOne({ email })) {
      return res.status(403).json({ error: 'A User with this email address already exists' });
    }
    const password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ email, name: req.body.name, phone: req.body.phone, password });
    return res.json({ authtoken: tokenFor(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(403).json({ error: 'A User with this email address already exists' });
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', [
  body('email').isString().trim().isEmail(),
  body('password').isString().isLength({ min: 1, max: 72 }),
], validate, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      return res.status(403).json({ error: 'Invalid Credentials' });
    }
    return res.json({ authtoken: tokenFor(user) });
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/user', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone,
      role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt });
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function updateUser(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.name = req.body.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    await user.save();
    return res.json({ authtoken: tokenFor(user) });
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
router.put('/update', authenticate, [nameRule(), phoneRule().optional()], validate, updateUser);
router.put('/user', authenticate, [nameRule(), phoneRule()], validate, updateUser);
module.exports = router;
