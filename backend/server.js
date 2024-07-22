const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Path to the JSON file
const jsonFilePath = path.join(__dirname, 'data.json');

app.get('/', (req, res) => {
  res.send('Welcome to the Data API!');
});

app.post('/save', (req, res) => {
  console.log('Received data:', req.body);

  const { email, weights, scores } = req.body;

  if (!email || !weights || !scores) {
    console.log('Missing required data');
    return res.status(400).send('Bad Request: Missing required data.');
  }

  const record = { email, weights, scores };

  // Read existing data
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // If file does not exist, create it with an empty array
        fs.writeFile(jsonFilePath, JSON.stringify([record], null, 2), 'utf8', (err) => {
          if (err) {
            console.error('Error writing to JSON file:', err.message);
            res.status(500).send(`Error: ${err.message}`);
          } else {
            console.log('Data saved successfully');
            res.send('Data saved successfully.');
          }
        });
      } else {
        console.error('Error reading JSON file:', err.message);
        res.status(500).send(`Error: ${err.message}`);
      }
    } else {
      // Parse existing data and add new record
      const existingData = JSON.parse(data);
      existingData.push(record);

      // Write updated data back to the file
      fs.writeFile(jsonFilePath, JSON.stringify(existingData, null, 2), 'utf8', (err) => {
        if (err) {
          console.error('Error writing to JSON file:', err.message);
          res.status(500).send(`Error: ${err.message}`);
        } else {
          console.log('Data saved successfully');
          res.send('Data saved successfully.');
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});