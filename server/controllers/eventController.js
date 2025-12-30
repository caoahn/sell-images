const { Event, School } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.createEvent = async (req, res) => {
  try {
    const { name, date, schoolId } = req.body;

    // Generate unique access code
    // Simple logic: SCHOOL_CODE + RANDOM. For now, random string.
    const accessCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const event = await Event.create({
      name,
      date,
      schoolId, // Optional if general event
      accessCode,
    });

    res.status(201).json({ message: 'Event created', event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
