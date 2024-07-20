import React from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

const Instructions = ({ showInstructions, handleClose, email, handleEmailChange, handleContinue, emailError }) => {
  return (
    <Modal show={showInstructions} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Instructions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please enter your email to continue to the Council Share Calculator.</p>
        <Form.Group>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)} // Directly handle the value
          />
          {emailError && <Alert variant="danger" className="mt-2">{emailError}</Alert>}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleContinue}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Instructions;
