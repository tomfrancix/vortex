import React from 'react';
import vortexIcon from '../assets/icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';

const Header = ({ websiteData, handleLogout, authenticated, company }) => {
  return (
    <header>
    <div className="collapse bg-light" id="navbarHeader">
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-8 col-md-7 py-4">
                    <h4>A Website for Task Management</h4>
                    <p className="text-dark">{websiteData.about}</p>
                </div>
                <div className="col-sm-4 offset-md-1 py-4">
                    <h4>By Thomas Fahey</h4>
                    <a href="https://tomfrancix.github.io" target="_blank">Visit My Portfolio</a>
                        {authenticated ? (
                            <button onClick={handleLogout} className="btn btn-sm btn-secondary mt-4" style={{float:"right"}}>Logout</button>
                        ) : (<></>)}
                </div>
            </div>
        </div>
    </div>
    <div className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">
            <a href="#" className="navbar-brand d-flex align-items-center">
                <FontAwesomeIcon icon={faTimeline} alt="Vortex Icon" className="website-icon" width="20" height="20" />
                <strong>{websiteData.websiteName}</strong>
            </a>
            {
                company != null ? (
                    <div className="ms-auto px-3">
                        <span className="text-dark-50 hide-sm">Current Company:</span> <strong>{company.name}</strong> 
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