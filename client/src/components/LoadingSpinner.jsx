// src/components/LoadingSpinner.jsx

import React from 'react';

const LoadingSpinner = () => (
  <div style={spinnerStyle}>
    <div className="spinner" />
  </div>
);

const spinnerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

export default LoadingSpinner;
