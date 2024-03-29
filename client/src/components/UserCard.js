import Grid from '@mui/material/Grid';
import '../styles/UserCard.css';
import { useEffect, useState, useCallback } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const UserCard = () => {
  const [randomUserData, setRandomUserData] = useState({});
  const [noMoreUsers, setNoMoreUsers] = useState(false);
  const [errorRateUser, setErrorRateUser] = useState('');
  const [errorFetcUser, setErrorFetchUser] = useState('');
  const auth_token = localStorage.getItem('auth_token');

  // Function to fetch a random user that hasn't been rated by the authenticated user
  const fetchRandomUser = useCallback(async () => {
    setErrorFetchUser('');
    try {
      const response = await fetch('/home/random', {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + auth_token,
        },
        mode: 'cors',
      });

      if (response.status == 404) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      } else if (response.status == 204) {
        setNoMoreUsers(true);
      } else if (!response.ok) {
        console.log(response);
        console.log(response.status);
        throw new Error('Failed to fetch a new user.');
      } else {
        const responseJson = await response.json();
        console.log(responseJson)
        setRandomUserData(responseJson.randomUser);
        setNoMoreUsers(false);
      }
    } catch (error) {
      setErrorFetchUser(error.message);
    }
  }, [auth_token]);

  useEffect(() => {
    fetchRandomUser();
  }, [fetchRandomUser]);

  // Function that handles a user's rating for another user (like/dislike).
  const handleRateUser = async (like) => {
    setErrorRateUser('');
    try {
      const response = await fetch('/home/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth_token,
        },
        body: JSON.stringify({ likedUserId: randomUserData._id, like }),
      });
      console.log(response);
      if (response.status == 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      } else if (!response.ok) {
        throw new Error('Failed to rate the user!');
      } else {
        // Fetch a new user to rate after successful rating
        fetchRandomUser();
      }
    } catch (error) {
      setErrorRateUser(error.message);
    }
  };

  return (
    <>
      <Grid id="userCard" container>
        {/* Display error message if failed to fetch a new user */}
        {errorFetcUser ? (
          <Grid id="userCard-errorFetch" item>
            <h3 id="errorFetch-infoText">{errorFetcUser}</h3>
          </Grid>
        ) : (
          <>
            {/* Display message if there are no more users */}
            {noMoreUsers ? (
              <Grid id="userCard-noUsers" item>
                <h3 id="noUsers-infoText">No more users!</h3>
              </Grid>
            ) : (
              <>
                {/* Display user information */}
                <Grid id="userCardHeading" item>
                  <p id="userCardTitle">{randomUserData.username}</p>
                </Grid>
                <Grid id="userCardContent" item>
                  <h3>Hi, I am {randomUserData.username}</h3>
                  <p>{randomUserData.introductionText}</p>
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item id="errorRateMessage">
          {errorRateUser && <p>{errorRateUser}</p>}
        </Grid>
      </Grid>
      <Grid id="matchButtons" container spacing={2} alignItems="center" justifyContent="center">
        <Grid item justifyContent="center" alignItems="center">
          <FavoriteBorderIcon id="disLikeButton" onClick={() => handleRateUser(false)} />
        </Grid>
        <Grid item>
          <FavoriteBorderIcon id="likeButton" onClick={() => handleRateUser(true)} />
        </Grid>
      </Grid>
    </>
  );
};

export default UserCard;
