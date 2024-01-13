import React from 'react';

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
                                <h2 className="pb-3">Collaboration Groups</h2>
                                {
                                    user.userCompanies?.length > 0 ? (
                                        user.userCompanies?.map((company, i) => (
                                            <div className="col-12 mb-1" key={i}>
                                                <button className="card bg-success text-light border-secondary p-2 w-100"
                                                    onClick={() => selectCompany(company.companyId)}>
                                                    {company.name}
                                                </button>
                                            </div>
                                        ))
                                    ) : (<></>)
                                }
                                <div className="col-12">
                                    <button className="card bg-dark text-light border-secondary p-2 w-100" onClick={createCompany}>
                                        Create a collaboration group
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