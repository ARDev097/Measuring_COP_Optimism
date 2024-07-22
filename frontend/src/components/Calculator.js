import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';

const defaultWeights = {
  WD: 35,
  WS: 25,
  WC: 10,
  WO: 5,
  WV: 15,
  WVe: 10,
};

const defaultScores = {
  "Token House": [4, 5, 4, 4, 5, 3],
  "Citizens' House": [5, 4, 5, 5, 4, 5],
  "Grants Council": [2, 1.5, 1.5, 1, 0.5, 0],
  "Grants Council M&M": [0.5, 0.5, 0.5, 0.5, 0, 0],
  "Security Council": [3, 2, 0, 3, 0, 0],
  "Code of Conduct Council": [1, 0.5, 0.5, 1, 0, 0],
  "Developer Advisory Board": [0.5, 0.5, 0, 1, 0, 0.5],
};

const parameterNames = [
  "Decision Making Authority (WD)",
  "Scope of Influence (WS)",
  "Community Engagement (WC)",
  "Operational Independence (WO)",
  "Voting Power (WV)",
  "Veto Power (WVe)"
];

const Calculator = ({ email }) => {
  const [weights, setWeights] = useState(defaultWeights);
  const [scores, setScores] = useState(defaultScores);
  const [results, setResults] = useState('');
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState(100);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    updateRemainingPercentage();
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, [weights]);

  const updateRemainingPercentage = () => {
    const totalWeight = Object.values(weights).reduce((acc, w) => acc + w, 0);
    setRemaining(100 - totalWeight);
  };

  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    const newValue = parseFloat(value) || 0;
    const totalWeight = Object.values(weights).reduce((acc, w) => acc + w, 0) - weights[name] + newValue;

    if (totalWeight > 100) {
      setError('Total weight exceeds 100%. Please adjust other weights.');
    } else {
      setError('');
      setWeights({ ...weights, [name]: newValue });
    }
  };

  const handleScoreChange = (council, index, value) => {
    const updatedScores = { ...scores };
    updatedScores[council][index] = parseFloat(value) || 0;
    setScores(updatedScores);
  };

  const saveData = async () => {
    try {
      await axios.post('http://localhost:5000/save', {
        email,
        weights,
        scores
      });
    } catch (error) {
      console.error("There was an error saving the data!", error);
    }
  };

  const calculateResults = () => {
    let totalWeightedScores = 0;
    const weightedScores = {};

    for (let council in scores) {
      const councilScores = scores[council];
      const weightedScore =
        councilScores[0] * (weights.WD / 100) +
        councilScores[1] * (weights.WS / 100) +
        councilScores[2] * (weights.WC / 100) +
        councilScores[3] * (weights.WO / 100) +
        councilScores[4] * (weights.WV / 100) +
        councilScores[5] * (weights.WVe / 100);

      if (!isNaN(weightedScore)) {
        weightedScores[council] = weightedScore;
        totalWeightedScores += weightedScore;
      } else {
        console.log(`NaN encountered for council: ${council}`);
      }
    }

    if (totalWeightedScores === 0) {
      setResults("Error: Total weighted score is zero, check weights and scores.");
    } else {
      let resultText = '';
      for (let council in weightedScores) {
        const percentage = (weightedScores[council] / totalWeightedScores) * 100;
        if (!isNaN(percentage)) {
          resultText += `${council}: (${percentage.toFixed(2)}%)\n`;
        } else {
          console.log(`NaN% encountered for council: ${council}`);
        }
      }
      setResults(resultText);
      setShowResults(true);
      saveData(); // Save data when results are calculated
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    window.location.reload(); // Reload the page to show Instructions
  };

  return (
    <div className="calculator">
      <h2 className="text-center my-4">Council and Committee Share Analyzer</h2>
      <div className="weights-container mb-4">
        <div className='wieghttitle'>
          <h3>Weights</h3>
          <div>(Weights for parameter)</div>
        </div>
        <div className="row">
          {Object.keys(defaultWeights).map((key, index) => (
            <div key={key} className="col-md-2 mb-3">
              <Form.Group>
                <Form.Label>{parameterNames[index]}</Form.Label>
                <Form.Control
                  type="text"
                  name={key}
                  value={weights[key]}
                  onChange={handleWeightChange}
                />
              </Form.Group>
            </div>
          ))}
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="mb-3">
          <strong>Remaining Percentage:</strong> {remaining}%
        </div>
      </div>
      <div className="scores-container">
        <div className='counciltitlel'>
          <h3>Score</h3>
          <div>(Score of parameter in each Council)</div>
        </div>
        {Object.keys(scores).map((council) => (
          <div key={council} className="mb-3">
            <div className='counciltitle'>{council}</div>
            <div className="row">
              {scores[council].map((score, index) => (
                <div key={index} className="col-md-2 mb-2">
                  <Form.Group>
                    <Form.Control
                      type="number"
                      value={score}
                      min="0"
                      max="5"
                      onChange={(e) =>
                        handleScoreChange(council, index, e.target.value)
                      }
                    />
                  </Form.Group>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="button-container d-flex justify-content-between mb-4">
        <Button
          style={{ flex: 1, marginRight: '10px' }}
          variant="primary"
          onClick={calculateResults}
        >
          Calculate Share
        </Button>
        <Button
           style={{ flex: 1, backgroundColor: '#6c757d', color: '#fff', border: 'none', marginRight: '10px' }}
          variant="secondary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      <Modal show={showResults} onHide={() => setShowResults(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Calculation Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>{results}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResults(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calculator;
