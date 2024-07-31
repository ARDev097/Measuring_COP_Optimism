import React, { useState, useEffect, useReducer } from "react";
import { Form, Alert, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "../styles/Calculator.css";

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
  WVe: "This parameter evaluates whether the HCC has the authority to veto or reject decisions made by other governance bodies.",
};

const parameterNames = [
  "Decision Making Authority (WD)",
  "Scope of Influence (WS)",
  "Community Engagement (WC)",
  "Operational Independence (WO)",
  "Voting Power (WV)",
  "Veto Power (WVe)",
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

  let resultText = "";
  for (let council in weightedScores) {
    const percentage = (weightedScores[council] / totalWeightedScores) * 100;
    if (!isNaN(percentage)) {
      resultText += `${council}: (${percentage.toFixed(2)}%)\n`;
    }
  }

  return resultText;
};

const weightsReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_WEIGHT":
      const { name, value } = action.payload;
      const newWeights = { ...state.weights, [name]: value };
      const newChangedValues = { ...state.changedValues };
      if (value !== defaultWeights[name]) {
        newChangedValues[`Weight: ${name}`] = {
          from: defaultWeights[name],
          to: value,
        };
      } else {
        delete newChangedValues[`Weight: ${name}`];
      }
      return { weights: newWeights, changedValues: newChangedValues };
    default:
      return state;
  }
};

const scoresReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_SCORE":
      const { council, index, value } = action.payload;
      const newScores = {
        ...state.scores,
        [council]: state.scores[council].map((score, i) =>
          i === index ? value : score
        ),
      };
      const newChangedValues = { ...state.changedValues };
      if (value !== defaultScores[council][index]) {
        newChangedValues[`Score: ${council} - ${parameterNames[index]}`] = {
          from: defaultScores[council][index],
          to: value,
        };
      } else {
        delete newChangedValues[`Score: ${council} - ${parameterNames[index]}`];
      }
      return { scores: newScores, changedValues: newChangedValues };
    default:
      return state;
  }
};

const Calculator = ({ email }) => {
  const isUserLoggedIn = () => {
    return localStorage.getItem("userEmail") !== null;
  };

  const [weightsState, weightsDispatch] = useReducer(weightsReducer, {
    weights:
      isUserLoggedIn() && localStorage.getItem("weights")
        ? JSON.parse(localStorage.getItem("weights"))
        : defaultWeights,
    changedValues:
      isUserLoggedIn() && localStorage.getItem("weightChangedValues")
        ? JSON.parse(localStorage.getItem("weightChangedValues"))
        : {},
  });

  const [scoresState, scoresDispatch] = useReducer(scoresReducer, {
    scores:
      isUserLoggedIn() && localStorage.getItem("scores")
        ? JSON.parse(localStorage.getItem("scores"))
        : defaultScores,
    changedValues:
      isUserLoggedIn() && localStorage.getItem("scoreChangedValues")
        ? JSON.parse(localStorage.getItem("scoreChangedValues"))
        : {},
  });

  const [results, setResults] = useState("");
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(100);
  const [showResults, setShowResults] = useState(false);
  const [defaultResults, setDefaultResults] = useState("");
  const [changedResults, setChangedResults] = useState("");

  const [changedFields, setChangedFields] = useState(() => {
    return isUserLoggedIn() && localStorage.getItem("changedFields")
      ? JSON.parse(localStorage.getItem("changedFields"))
      : {};
  });

  const ChangedDataDisplay = ({
    defaultResults,
    changedResults,
    changedValues,
  }) => {
    return (
      <div className="changed-data-display">
        <h4>HCC Influence Analysis</h4>
        <div>
          <h5 style={{ color: "black" }}>Influence Based on Initial Values</h5>
          <pre>{defaultResults}</pre>
        </div>
        <div>
          <h5 style={{ color: "black" }}>
            Influence Based on Your Adjustments
          </h5>
          <pre>{changedResults}</pre>
        </div>
        <div>
          <h5 style={{ color: "black" }}>Changed Values</h5>
          {Object.entries(changedValues).map(([key, value]) => (
            <p key={key}>
              {key}: {value.from} → {value.to}
            </p>
          ))}
        </div>

        <div className="button-container">
          <button onClick={calculateResultsAndShow} className="savedatabutton">
            Save Data
          </button>
        </div>
        <div
          className="goal-box"
          style={{
            backgroundColor: "lightcoral",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            color: "black",
          }}
        >
          The goal of this exercise is to identify Influence of different HCC in
          Optimism Collective.
        </div>
      </div>
    );
  };

  useEffect(() => {
    setDefaultResults(calculateResults(defaultWeights, defaultScores));
    setChangedResults(
      calculateResults(weightsState.weights, scoresState.scores)
    );
    updateRemainingPercentage();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isUserLoggedIn()) {
      localStorage.setItem("weights", JSON.stringify(weightsState.weights));
      localStorage.setItem("scores", JSON.stringify(scoresState.scores));
      localStorage.setItem("changedFields", JSON.stringify(changedFields));
      localStorage.setItem(
        "weightChangedValues",
        JSON.stringify(weightsState.changedValues)
      );
      localStorage.setItem(
        "scoreChangedValues",
        JSON.stringify(scoresState.changedValues)
      );
    }
    updateRemainingPercentage();
    setChangedResults(
      calculateResults(weightsState.weights, scoresState.scores)
    );
  }, [weightsState, scoresState, changedFields]);

  const updateRemainingPercentage = () => {
    const totalWeight = Object.values(weightsState.weights).reduce(
      (acc, w) => acc + w,
      0
    );
    setRemaining(100 - totalWeight);
  };

  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    const newValue = parseFloat(value) || 0;
    const totalWeight =
      Object.values(weightsState.weights).reduce((acc, w) => acc + w, 0) -
      weightsState.weights[name] +
      newValue;

    if (totalWeight > 100) {
      setError("Total weight exceeds 100%. Please adjust other weights.");
    } else {
      setError("");
      weightsDispatch({
        type: "UPDATE_WEIGHT",
        payload: { name, value: newValue },
      });

      setChangedFields((prev) => ({
        ...prev,
        [`weight-${name}`]: newValue !== defaultWeights[name],
      }));
    }
  };

  useEffect(() => {
    if (results) {
      saveData();
    }
  }, [results]);

  const saveData = async () => {
    try {
      await axios.post("https://cop.lamproslabs.io/save", {
        email,
        weights: weightsState.weights,
        scores: scoresState.scores,
        results,
      });
    } catch (error) {
      console.error("There was an error saving the data!", error);
    }
  };

  const calculateResultsAndShow = () => {
    const results = calculateResults(weightsState.weights, scoresState.scores);
    setResults(results);
    setShowResults(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("weights");
    localStorage.removeItem("scores");
    localStorage.removeItem("changedFields");
    localStorage.removeItem("weightChangedValues");
    localStorage.removeItem("scoreChangedValues");
    window.location.reload();
  };

  const handlelogoutclose = () => {
    handleLogout();
    setShowResults(false);
  };

  const handleInputChange = (council, index, value) => {
    const parsedValue = parseFloat(value, 10);
    if (parsedValue >= 0 && parsedValue <= 5) {
      scoresDispatch({
        type: "UPDATE_SCORE",
        payload: { council, index, value: parsedValue },
      });
      setChangedFields((prev) => ({
        ...prev,
        [`score-${council}-${index}`]:
          parsedValue !== defaultScores[council][index],
      }));
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator-content">
        <div className="form-section">
          <div className="header-pw">
            <h2 className="text-center my-4" style={{ paddingTop: "30px" }}>
              HCC Influence Analyzer
            </h2>
            <div className="weights-container">
              <div className="wieghttitle">
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
                          overlay={
                            <Tooltip id={`tooltip-${key}`}>
                              {parameterDescriptions[key]}
                            </Tooltip>
                          }
                        >
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="info-icon"
                          />
                        </OverlayTrigger>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={key}
                        value={weightsState.weights[key]}
                        onChange={handleWeightChange}
                        className="weight-field"
                        style={{
                          backgroundColor: changedFields[`weight-${key}`]
                            ? "#f9bfbf"
                            : "",
                        }}
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
            <div className="counciltitlel">
              <h3>Parameter Scores</h3>
              <div>(Score of parameter in each Council)</div>
            </div>
            {Object.keys(scoresState.scores).map((council) => (
              <div key={council} className="mb-3">
                <div className="counciltitle">{council}</div>
                <div className="row">
                  {scoresState.scores[council].map((score, index) => (
                    <div key={index} className="col-md-4 mb-2">
                      <div style={{ fontSize: "small", color: "grey" }}>
                        {parameterNames[index]}
                      </div>
                      <Form.Group>
                        <Form.Control
                          type="number"
                          value={score}
                          min="0"
                          max="5"
                          onChange={(e) =>
                            handleInputChange(council, index, e.target.value)
                          }
                          className="score-field"
                          style={{
                            backgroundColor: changedFields[
                              `score-${council}-${index}`
                            ]
                              ? "#f9bfbf"
                              : "",
                          }}
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
          <ChangedDataDisplay
            defaultResults={defaultResults}
            changedResults={changedResults}
            changedValues={{
              ...weightsState.changedValues,
              ...scoresState.changedValues,
            }}
          />
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
          <button className="savedatabutton" onClick={handlelogoutclose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calculator;
