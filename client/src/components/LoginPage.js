import { Grid, TextField, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../styles/LoginPage.css';

const LoginPage = () => {
  // State of the login form
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // State for displaying an error message if login fails
  const [errorMessage, setErrorMessage] = useState('');

  // Handler function for form input changes, updates the loginData state
  const handleLoginChange = (event) => {
    setLoginData({ ...loginData, [event.target.name]: event.target.value });
  };

  // Handler fuction for form submission
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    // Login the user by sending a GET request to the server
    try {
      const responseLogin = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(loginData),
        mode: 'cors',
      });
      const responseJson = await responseLogin.json();
      console.log(responseJson);
      if (responseLogin.status === 200) {
        // If login is successful, redirect to the home page
        window.location.href = '/';
      } else {
        // If login fails, set an error message to the state
        setErrorMessage(responseJson.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid id="loginBackground" item>
        <p id="loginLogo">Matcher</p>
      </Grid>
      <Grid item id="loginFormGrid">
        <form id="loginForm" onSubmit={handleLoginSubmit}>
          <Typography id="loginTitle">
            Log in to the <span>Matcher...</span>
          </Typography>
          <TextField
            className="customTextField"
            id="username"
            name="username"
            type="text"
            label="Username"
            margin="normal"
            onChange={handleLoginChange}
          ></TextField>

          <TextField
            className="customTextField"
            id="password"
            name="password"
            type="password"
            label="Password"
            margin="normal"
            onChange={handleLoginChange}
          ></TextField>
          {/* Display error message if login fails */}
          {errorMessage && <p id="loginErrorMessage">{errorMessage}</p>}
          <Button id="loginButton" type="submit" variant="contained" size="large">
            Log in
          </Button>
          <Typography id="signupLinkInfo">
            {"Don't have an account?"}
            <Link id="signupLink" to="/register" style={{ textDecoration: 'none' }}>
              {' '}
              Sign Up
            </Link>
          </Typography>
        </form>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
