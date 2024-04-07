// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Track if the user is registering
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isRegistering ? 'https://webapiproject-bw74.onrender.com/register' : 'https://webapiproject-bw74.onrender.com/auth';
      const response = await axios.post(url, { user: username, pwd: password });
      localStorage.setItem('accessToken', response.data.accessToken);
      if (isRegistering) {
        // If registering, navigate back to login after successful registration
        setIsRegistering(false);
        setErrorMessage('');
      } else {
        // Redirect to map page if logging in
        navigate('/map');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response && error.response.status === 409) {
        setErrorMessage(isRegistering ? 'Username already exists. Please choose a different username.' : 'Invalid username or password. Please try again.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };
  
  const toggleForm = () => {
    setIsRegistering(!isRegistering); // Toggle between login and registration forms
    setErrorMessage(''); // Clear any previous error messages
  };

  return (
    <div style={{ width: '300px', margin: 'auto', marginTop: '50px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>{isRegistering ? 'Register' : 'Login'}</h2>
      {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer' }}>{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        {isRegistering ? 'Already have an account?' : 'Don\'t have an account?'} 
        <button onClick={toggleForm} style={{ marginLeft: '5px', cursor: 'pointer', border: 'none', background: 'none', color: '#007bff' }}>
          {isRegistering ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
}

export default LoginPage;
