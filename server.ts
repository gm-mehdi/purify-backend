import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import connectMongoDB from './db';

const app = express();
const PORT = process.env.PORT || 5000;

// Schema
const dataSchema = new mongoose.Schema({
  ppm: Number,
  humidity: Number,
  temperature: Number,
  pressure: Number,
  timestamp: { type: Date, default: Date.now }
});

// Model
const Data = mongoose.model('Data', dataSchema);

// Middleware
app.use(bodyParser.json());

// Store data
app.post('/', async (req, res) => {
  try {
    const newData = new Data({
      ppm: req.body.ppm,
      humidity: req.body.humidity,
      temperature: req.body.temperature,
      pressure: req.body.pressure
    });
    await newData.save();
    res.status(201).send(newData);
  } catch (error) {
    res.status(400).send(error);
  }
}); 

// Get all data
app.get('/', async (req, res) => {
  try {
    const values = await Data.find().sort({ timestamp: -1 }).limit(10);
    res.send(values);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
    connectMongoDB();
    console.log(`Server running on port ${PORT}`)
});
