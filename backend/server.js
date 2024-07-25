const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./models');
const Data = require('./models/Data');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Data API!');
});

app.post('/save', async (req, res) => {
  console.log('Received data:', req.body);

  const { email, weights, scores, results } = req.body;

  if (!email || !weights || !scores || results === undefined) {
    console.log('Missing required data');
    return res.status(400).send('Bad Request: Missing required data.');
  }

  try {
    // Create a new record in the database with a unique calculationId
    const record = await Data.create({ email, weights, scores, results });
    console.log('Data saved successfully:', record.calculationId);
    res.send('Data saved successfully.');
  } catch (error) {
    console.error('Error saving data:', error.message);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
