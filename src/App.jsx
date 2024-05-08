import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LoadingIndicator from './components/LoadingIndicator';
import { api } from './services/api';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already logged in when the component mounts
  useEffect(() => {
    // Check session validity
    api.checkSession()
      .then(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Session check failed:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Dashboard onLogout={handleLogout} />
    </div>
  );
};

export default App;


