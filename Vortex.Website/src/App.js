import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import LandingPage from './components/LandingPage';
import websiteData from './data.json';

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await fetch('/api/Account/get-current-user', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUser(prevUser => ({ ...prevUser, isLoggedIn: true }));
        } else {
          console.error('Failed to get user profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error getting user profile:', error);
      } finally {
        // Set loading to false once the request is completed
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <div>
      {isLoading ? (
        // Display loading spinner while fetching data
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          <p>Loading...</p>
        </div>
      ) : (
        user?.isLoggedIn ? (
          // Authenticated Page
          <div>
            <p>Hello, {user?.name}!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          // Non-Authenticated Page
          <div>
            <LandingPage setUser={setUser} websiteData={websiteData} />
          </div>
        )
      )}
    </div>
  );
};

export default App;