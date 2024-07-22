import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import './App.css';
import Calculator from './components/Calculator';
import Instructions from './components/Instructions';

function App() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    // Check local storage to determine whether to show Instructions or Calculator
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      setShowInstructions(false);
    }
  }, []);

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handleContinue = () => {
    if (validateEmail(email)) {
      localStorage.setItem('userEmail', email); // Save email to local storage
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
