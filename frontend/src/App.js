import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import './App.css';
import Calculator from './components/Calculator';
import Instructions from './components/Instructions';

function App() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handleContinue = () => {
    if (validateEmail(email)) {
      setShowInstructions(false);
      setEmailError('');
    } else {
      setEmailError('Please enter a valid email address.');
    }
  };

  const handleClose = () => {
    setShowInstructions(false);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  return (
    <Container>
      <Instructions
        showInstructions={showInstructions}
        handleClose={handleClose}
        email={email}
        handleEmailChange={handleEmailChange}
        handleContinue={handleContinue}
        emailError={emailError}
      />
      {!showInstructions && <Calculator email={email} />}
    </Container>
  );
}

export default App;
