import React from 'react';

const SelectedCompany = ({ selectedCompany }) => {

  return (
    <div className="flex-shrink-0 p-3 bg-white" style={{ width: '280px' }}>
      <h3 className="d-flex">
        <span className="fs-5 fw-semibold">{selectedCompany.name}</span>
      </h3>
      <ul className="px-0" >
        <li className="list-unstyled">
          <a className="btn btn-default btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
            <strong>Users</strong>
          </a>
          <div className="collapse show" id="home-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><a href="#" className="link-dark rounded px-2">View all</a></li>
              <li><a href="#" className="link-dark rounded px-2">Invite</a></li>
            </ul>
          </div>
        </li>
        <li className="list-unstyled">
          <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
          <strong>Projects</strong>
          </button>
          <div className="collapse" id="dashboard-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><a href="#" className="link-dark px-2">Overview</a></li>
              <li><a href="#" className="link-dark px-2">Weekly</a></li>
              <li><a href="#" className="link-dark px-2">Monthly</a></li>
              <li><a href="#" className="link-dark px-2">Annually</a></li>
            </ul>
          </div>
        </li>
        <li className="list-unstyled">
          <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">
            Orders
          </button>
          <div className="collapse" id="orders-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><a href="#" className="link-dark rounded">New</a></li>
              <li><a href="#" className="link-dark rounded">Processed</a></li>
              <li><a href="#" className="link-dark rounded">Shipped</a></li>
              <li><a href="#" className="link-dark rounded">Returned</a></li>
            </ul>
          </div>
        </li>
        <li className="list-unstyled border-top my-3"></li>
        <li className="list-unstyled">
          <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded="false">
            Account
          </button>
          <div className="collapse" id="account-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><a href="#" className="link-dark rounded">New...</a></li>
              <li><a href="#" className="link-dark rounded">Profile</a></li>
              <li><a href="#" className="link-dark rounded">Settings</a></li>
              <li><a href="#" className="link-dark rounded">Sign out</a></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default SelectedCompany;