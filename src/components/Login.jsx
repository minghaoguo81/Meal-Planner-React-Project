import React, { useState } from 'react';
import '../css/Login.css';
import { api } from '../services/api';
import LoadingIndicator from './LoadingIndicator';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
  
    api.login(username)
      .then((data) => {
        setIsLoading(false);
        onLoginSuccess(username, data.sessionId);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.message || 'Login failed. Username may not be allowed.');
        console.error(error);
      });
  };

  if (isLoading) return <LoadingIndicator />;

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

