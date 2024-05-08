import React from 'react';
import '../css/LoadingIndicator.css';

const LoadingIndicator = () => (
  <div className="loading-indicator">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

export default LoadingIndicator;