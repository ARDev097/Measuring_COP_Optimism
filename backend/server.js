const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// CSV Writer setup
const csvWriter = createObjectCsvWriter({
  path: path.join(__dirname, 'data.csv'),
  header: [
    { id: 'email', title: 'Email' },
    { id: 'weights', title: 'Weights' },
    { id: 'scores', title: 'Scores' },
  ],
  append: true // Ensure that new records are appended to the file
});

// Route to handle saving data
app.post('/save', (req, res) => {
  console.log('Received data:', req.body); // Log incoming data

  const { email, weights, scores } = req.body;

  if (!email || !weights || !scores) {
    console.log('Missing required data'); // Log missing data error
    return res.status(400).send('Bad Request: Missing required data.');
  }

  const record = {
    email,
    weights: JSON.stringify(weights),
    scores: JSON.stringify(scores),
  };

  csvWriter.writeRecords([record])
    .then(() => {
      console.log('Data saved successfully'); // Log success
      res.send('Data saved successfully.');
    })
    .catch(error => {
      console.error('Error writing to CSV:', error.message); // Log error
      res.status(500).send(`Error: ${error.message}`);
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
