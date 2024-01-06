import React from 'react';
import vortexIcon from '../assets/icon.png';

const Header = ({ websiteName }) => {
  return (
    <nav className="navbar navbar-expand-sm" style={{ zIndex: "100", position:"relative", backgroundColor:"white"}}>
        <div className="container-fluid">
            <a className="navbar-brand" href="#">
                <img src={vortexIcon} alt="Vortex Icon" className="website-icon" /> 
                {websiteName}
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="collapsibleNavbar">
                <ul className="navbar-nav">
                    <li className="nav-item">
                    <a className="nav-link" href="#">Link</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Link</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Link</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  );
};

export default Header;