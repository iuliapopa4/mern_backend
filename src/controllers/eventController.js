const { validationResult } = require('express-validator');
const Event = require('../models/eventModel');
const nodemailer = require('nodemailer');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, date, location, members } = req.body;

  const event = new Event({
    name,
    description,
    date,
    location,
    members,
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, description, date, location, members } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.name = name;
    event.description = description;
    event.date = date;
    event.location = location;
    event.members = members;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.remove();
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const addMemberToEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, memberEmail } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.members.includes(memberEmail)) {
      return res.status(400).json({ message: 'Member already exists in the event' });
    }

    event.members.push(memberEmail);
    const updatedEvent = await event.save();

    res.json({ message: 'Member added to the event successfully', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add member to the event' });
  }
};

const removeMemberFromEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, memberEmail } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.members.includes(memberEmail)) {
      return res.status(400).json({ message: 'Member does not exist in the event' });
    }

    event.members = event.members.filter((email) => email !== memberEmail);
    const updatedEvent = await event.save();

    res.json({ message: 'Member removed from the event successfully', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove member from the event' });
  }
};

const sendInvitation = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token not found' });
    }
    const accessToken = authHeader.split(' ')[1];

    const { toEmail, eventName } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: req.userEmail,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken, 
      },
    });

    const mailOptions = {
      from: req.userEmail, 
      to: toEmail, 
      subject: 'Invitation to Event',
      text: `You are invited to the event "${eventName}".`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Invitation email sent successfully' });
  } catch (error) {
    console.error('Error sending invitation email:', error);
    res.status(500).json({ message: 'Failed to send invitation email' });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  sendInvitation,
  addMemberToEvent,
  removeMemberFromEvent,
};




