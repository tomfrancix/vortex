import React from 'react';
import vortexIcon from '../assets/icon.png';

const Header = ({ websiteData, handleLogout, authenticated, company }) => {
  return (
    <header>
    <div className="collapse bg-light" id="navbarHeader">
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-8 col-md-7 py-4">
                    <h4>About</h4>
                    <p className="text-muted">{websiteData.about}</p>
                </div>
                <div className="col-sm-4 offset-md-1 py-4">
                    <h4>Contact</h4>
                    <ul className="list-unstyled">
                        {authenticated ? (
                            <li><button onClick={handleLogout}>Logout</button></li>
                        ) : (<></>)}
                        <li><a href="#">Like on Facebook</a></li>
                        <li><a href="#">Email me</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div className="navbar navbar-light bg-light shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">
            <a href="#" className="navbar-brand d-flex align-items-center">
                <img src={vortexIcon} alt="Vortex Icon" className="website-icon" width="20" height="20" />
                <strong>{websiteData.websiteName}</strong>
            </a>
            {
                company != null ? (
                    <div className="ms-auto px-3">
                        <span className="text-dark-50">Current Company:</span> <strong>{company.name}</strong> 
                    </div>
                ) : ( <></>)
            }
            
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        </div>
    </div>
</header>
  );
};

export default Header;