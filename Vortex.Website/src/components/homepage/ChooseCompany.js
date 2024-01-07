import React, { useEffect } from 'react';

const ChooseCompany = ({ user, createCompany, setCompany }) => {
    console.log(user.userCompanies);
    
    useEffect(() => {
        console.log('user.userCompanies', user.userCompanies);

      }, [user]);

    const token = localStorage.getItem('accessToken');
    const getCompany = async (url, id) => {
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

    const chooseCompany = async (id) => {
        await getCompany('/api/Company/read', id);
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
                            {user.userCompanies?.$values?.length > 0 ? (
                            user.userCompanies?.$values.map((company, i) => (
                                <div className="col-12 mb-1" key={i}>
                                {/* Adding a key attribute to the parent div */}
                                <button className="card bg-success text-light border-secondary p-2 w-100"
                                    onClick={() => chooseCompany(company.companyId)}>
                                    {company.name}
                                </button>
                                </div>
                            ))
                            ) : (
                            <></>
                            )}
                            <div className="col-12">
                            <button
                                className="card bg-dark text-light border-secondary p-2 w-100"
                                onClick={createCompany}
                            >
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