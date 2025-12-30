const { User, Event } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, fullName, role, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      role: role || 'PARENT',
      phone,
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.accessEvent = async (req, res) => {
  try {
    const { accessCode } = req.body;
    const event = await Event.findOne({ where: { accessCode } });

    if (!event) return res.status(404).json({ message: 'Invalid Access Code' });
    if (event.status !== 'ACTIVE') return res.status(403).json({ message: 'Event is locked' });

    // Generate a temporary token for this event session
    const eventToken = jwt.sign({ eventId: event.id, role: 'GUEST' }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ message: 'Access granted', eventToken, eventId: event.id, eventName: event.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
