import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Manager from './components/Manager';
import data from './data.json';
import { useAuth0 } from '@auth0/auth0-react';

const Home = ({loginWithRedirect}) => (
  <div className="container-fluid bg-dark"  style={{ minHeight: '100vh', top:0, bottom:0, paddingTop:"60px" }}> 
    <div className="row">
      <div className="col-sm-12 p-1"></div>
      <div className="container-fluid text-center p-5 text-light">
          <h1>Welcome</h1>
          <br/>
          <button onClick={() => loginWithRedirect()} className="btn btn-light">Login</button>
        </div>
    </div>
  </div>
);

const AuthenticatedPage = ({user, logout, getAccessTokenSilently}) => (
  <>
    <div className="container-fluid bg-dark">
      <div className="row">
        <div className="col-sm-12 p-1">
          <div className="float-end d-flex text-light">
            <p className="mb-0 p-1">Hello, {user.name}!</p>
            <button onClick={() => logout()} className="btn btn-sm btn-light">Logout</button>
          </div>
        </div>
      </div>
    </div>
    <Manager getAccessTokenSilently={getAccessTokenSilently}/>
  </>
);

const App = () => {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading, getAccessTokenSilently } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <Header websiteName={data.websiteName} />
        <main>
          <Routes>
            <Route path="/" exact>
              {isAuthenticated ? (
                <Route exact path='/' element={<AuthenticatedPage user={user} logout={logout} getAccessTokenSilently={getAccessTokenSilently} />}/>
              ) : (
                <Route exact path='/' element={<Home loginWithRedirect={loginWithRedirect}/>} />
              )}
            </Route>
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;