import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

const ChooseCompany = ({ user, createCompany, setCompany }) => {
    
    const token = localStorage.getItem('accessToken');

    const selectCompany = async (id) => {
        var url = '/api/Company/read';

        try {
            const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(id)
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setCompany(data)
            } else {
                console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
            }
        } catch (error) {
            console.error(`Error ${url.split('/').pop()}:`, error);
        }
    };

    const respondToInvitation = async (id) => {
        var url = '/api/Company/read';

        try {
            const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(id)
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setCompany(data)
            } else {
                console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
            }
        } catch (error) {
            console.error(`Error ${url.split('/').pop()}:`, error);
        }
    };

    return (
        <section className="py-4 text-center container-fluid bg-dark text-light">
            <div className="row py-lg-5">
                <div className="col-lg-7 col-md-12 col-sm-12 mx-auto">
                    <div>
                        <h1 className="fw-light">
                        Welcome {user.firstName} {user.lastName}
                        </h1>
                        <div className="container-fluid pt-5">
                            <div className="row">
                                <h3 className=" text-start"><small>Invitations</small></h3>
                                {
                                    user.invitations?.length > 0 ? (
                                        user.invitations?.map((invitation, i) => (
                                            <div className="col-12 mb-1" key={i}>
                                                <div className="card bg-purple text-light border-secondary p-2 w-100 d-flex flex-row">
                                                    <div className="flex-grow-1 text-start p-1 d-flex">
                                                        <FontAwesomeIcon icon={faUsers} className="pt-1" />
                                                        <div className="mx-2">{invitation.companyName}</div>
                                                        </div>
                                                    <div className="input-group w-auto">
                                                        <button className="btn btn-sm btn-success"
                                                            onClick={() => respondToInvitation(invitation.companyId, true)}>
                                                            Accept
                                                        </button>
                                                        <button className="btn btn-sm btn-danger"
                                                            onClick={() => respondToInvitation(invitation.companyId, false)}>
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (<></>)
                                }
                            </div>
                            <hr />
                            <div className="row">
                                <h3 className=" text-start"><small>Your Groups</small></h3>
                                {
                                    user.userCompanies?.length > 0 ? (
                                        user.userCompanies?.map((company, i) => (
                                            <div className="col-12 mb-1" key={i}>
                                                <button className="card bg-blue text-light border-secondary p-2 w-100" onClick={() => selectCompany(company.companyId)}>
                                                        <div className="flex-grow-1 text-start p-1 d-flex">
                                                            <FontAwesomeIcon icon={faUsers} className="pt-1" />
                                                            <div className="mx-2">{company.name}</div>
                                                        </div>
                                                </button>
                                            </div>
                                        ))
                                    ) : (<></>)
                                }
                                <div className="col-12">
                                    <button className="card bg-dark text-light border-secondary p-2 w-100" onClick={createCompany}>
                                        Create a group
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
  };
  
  export default ChooseCompany;