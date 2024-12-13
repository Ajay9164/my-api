require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  message: { type: String },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// API Endpoint: Book an Appointment (POST)
app.post('/api/book-appointment', async (req, res) => {
  const { fullName, email, phone, appointmentDate, message } = req.body;

  if (!fullName || !email || !phone || !appointmentDate) {
    return res.status(400).json({ error: 'All fields except "message" are required' });
  }

  try {
    const newAppointment = new Appointment({ fullName, email, phone, appointmentDate, message });
    await newAppointment.save();
    res.status(200).json({ message: 'Appointment booked successfully!' });
  } catch (error) {
    console.error('Error saving appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// API Endpoint: Get All Appointments (GET)
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({ data: appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
