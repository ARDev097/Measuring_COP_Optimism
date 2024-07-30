import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/Calculator.css';

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
  "Grants Council M&M (Milestones & Metrics)": [0.5, 0.5, 0.5, 0.5, 0, 0],
  "Security Council": [3, 2, 0, 3, 0, 0],
  "Code of Conduct Council": [1, 0.5, 0.5, 1, 0, 0],
  "Developer Advisory Board": [0.5, 0.5, 0, 1, 0, 0.5],
};

const parameterDescriptions = {
  WD: "This parameter measures the extent to which a HCC has the power to make binding decisions that affect the governance or operations of Optimism.",
  WS: "This parameter assesses the breadth of the HCC impact within the Optimism ecosystem, including the range of areas or activities they influence.",
  WC: "This parameter evaluates how actively the HCC interacts with the community, including gathering feedback, holding public meetings, and providing updates.",
  WO: "This parameter measures the degree of autonomy the HCC has in its operations, including budget control, decision-making processes, and procedural oversight.",
  WV: "This parameter assesses the extent of voting authority held by the HCC members, including the ability to approve or reject proposals.",
  WVe: "This parameter evaluates whether the HCC has the authority to veto or reject decisions made by other governance bodies."
};

const parameterNames = [
  "Decision Making Authority",
  "Scope of Influence",
  "Community Engagement",
  "Operational Independence",
  "Voting Power",
  "Veto Power"
];

const calculateResults = (weights, scores) => {
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
    }
  }

  let resultText = '';
  for (let council in weightedScores) {
    const percentage = (weightedScores[council] / totalWeightedScores) * 100;
    if (!isNaN(percentage)) {
      resultText += `${council}: (${percentage.toFixed(2)}%)\n`;
    }
  }

  return resultText;
};


const Calculator = ({ email }) => {

  const [weights, setWeights] = useState(defaultWeights);
  const [scores, setScores] = useState(defaultScores);
  const [results, setResults] = useState('');
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState(100);
  const [showResults, setShowResults] = useState(false);
  const [defaultResults, setDefaultResults] = useState('');
  const [changedResults, setChangedResults] = useState('');

  const ChangedDataDisplay = ({ defaultResults, changedResults }) => {
    return (
      <div className="changed-data-display">
        <h4>HCC Influence Analysis</h4>
        <div>
          <h5 style={{ color: 'black' }}>Influence Based on Initial Values</h5>
          <pre>{defaultResults}</pre>
        </div>
        <div>
          <h5 style={{ color: 'black' }}>Influence Based on Your Adjustments</h5>
          <pre>{changedResults}</pre>
        </div>
        <div className="button-container">
              <button
                
                onClick={calculateResultsAndShow}
                className='savedatabutton'
              >
                Save Data
              </button>
            </div>
      </div>
    );
  };
  
  useEffect(() => {
    setDefaultResults(calculateResults(defaultWeights, defaultScores));
    setChangedResults(calculateResults(weights, scores));
    updateRemainingPercentage();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    updateRemainingPercentage();
    setChangedResults(calculateResults(weights, scores));
  }, [weights, scores]);

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

  useEffect(() => {
    if (results) {
      saveData();
    }
  }, [results]);

  const saveData = async () => {
    try {
      await axios.post('https://cop.lamproslabs.io/save', {
        email,
        weights,
        scores,
        results
      });
    } catch (error) {
      console.error("There was an error saving the data!", error);
    }
  };

  const calculateResultsAndShow = () => {
    const results = calculateResults(weights, scores);
    setResults(results);
    setShowResults(true);
    // handleLogout();
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    window.location.reload();
  };

  const handlelogoutclose = () => {
    handleLogout()
    setShowResults(false)
  }

  return (
    <div className="calculator-container">
      <div className="calculator-content">
        <div className="form-section">
          <div className="header-pw">

          <h2 className="text-center my-4" style={{paddingTop:"30px"}}>HCC Influence Analyzer</h2>
          <div className="weights-container">
            <div className='wieghttitle'>
              <h3>Parameter Weights</h3>
              <div>(Weights for parameter)</div>
            </div>
            <div className="row">
              {Object.keys(defaultWeights).map((key, index) => (
                <div key={key} className="col-md-4 mb-3">
                  <Form.Group>
                    <Form.Label className="weight-label">
                      {parameterNames[index]}
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-${key}`}>{parameterDescriptions[key]}</Tooltip>}
                        >
                        <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                      </OverlayTrigger>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={key}
                      value={weights[key]}
                      onChange={handleWeightChange}
                      className="weight-field"
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
          </div>
          <div className="scores-container">
            <div className='counciltitlel'>
              <h3>Parameter Scores</h3>
              <div>(Score of parameter in each Council)</div>
            </div>
            {Object.keys(scores).map((council) => (
              <div key={council} className="mb-3">
                <div className='counciltitle'>{council}</div>
                <div className="row">
                  {scores[council].map((score, index) => (
                    <div key={index} className="col-md-4 mb-2">
                      <div style={{ fontSize: 'small', color: 'grey' }}>{parameterNames[index]}</div>
                      <Form.Group>
                        <Form.Control
                          type="number"
                          value={score}
                          min="0"
                          max="5"
                          onChange={(e) =>
                            handleScoreChange(council, index, e.target.value)
                          }
                          className="score-field"
                        />
                      </Form.Group>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
         
        </div>
        <div className="changed-data-section">
          <ChangedDataDisplay defaultResults={defaultResults} changedResults={changedResults} />
        </div>
      </div>
      <Modal show={showResults} onHide={() => setShowResults(false)}>
        <Modal.Header>
          <Modal.Title>Data submitted successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1></h1>
          <pre>{results}</pre>
        </Modal.Body>
        <Modal.Footer>
          <button className='savedatabutton' onClick={handlelogoutclose }>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calculator;