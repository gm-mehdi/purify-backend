const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

const connectMongoDB = async () => {
  try {
      const MONGO_DBURI = 'mongodb+srv://mehdielgoummadi:JI6YJzI5fhdY7r0E@cluster0.4zlbhyc.mongodb.net/add-value?retryWrites=true&w=majority&appName=Cluster0';
      await mongoose.connect(MONGO_DBURI);
      console.log("Connected to MongoDB");
  } catch (error) {
      console.error("Error connecting to MongoDB: ", error);
  } 
}; 

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
app.post('/api/data', async (req, res) => {
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
app.get('/api/data', async (req, res) => {
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
