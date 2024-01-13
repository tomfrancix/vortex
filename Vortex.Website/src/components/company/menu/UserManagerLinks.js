import React, { useState } from 'react';
import { useFormik } from 'formik';

const UserManagerLinks = ({company, setCompany, currentCollaborator, setCollaborator}) => {
    const token = localStorage.getItem('accessToken');
    const [newCollaboratorFormIsVisible, displayNewCollaboratorForm] = useState(false);

    const addCollaborator = async (formData) => {
        var url = '/api/Collaborator/add';
        
        try {
            const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
            });
        
            if (response.ok) {
            const data = await response.json();
            displayNewCollaboratorForm(false);
        
            setCompany((prevCompany) => {
                const updatedCollaborators = [...prevCompany.users, data];
        
                const updatedCompany = { ...prevCompany, users: updatedCollaborators };
        
                return updatedCompany;
            });

            formik.resetForm();

            } else {
                console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
            }
        } catch (error) {
            console.error(`Error ${url.split('/').pop()}:`, error);
        }
    };

    const selectCollaborator = async (formData) => {
        setCollaborator(null);
        var url = '/api/Collaborator/read'
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
            });

        if (response.ok) {
            const collaborator = await response.json();
            setCollaborator(collaborator);
            displayNewCollaboratorForm(false)
        } else {
            console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
        }
    };

    const removeCollaborator = async (id) => {

        var url = '/api/Collaborator/delete'

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
        setCollaborator(null);
        setCompany((prevCompany) => {
            const updatedCollaborators = prevCompany.users.filter(
            (users) => users.userId !== id
            );

            const updatedCompany = { ...prevCompany, users: updatedCollaborators };
    
            return updatedCompany;
        });
        } else {
        console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
        }
    };

    const formik = useFormik({
        initialValues: {
            name: ''
        },
        onSubmit: values => {
            values.companyId = company.companyId;
            addCollaborator(values);
        },
    });
    return (
        <div className="py-4">
            <h2 className="fs-6">Collaborators</h2>
            <hr/>
            
            {/*Render the option to add a new collaborator.*/}
            {
            newCollaboratorFormIsVisible ? (
                <form onSubmit={formik.handleSubmit}>
                    <div className="input-group mb-2 fs-6">
                        <input type="hidden" name="companyId" value={company.companyId} />
                        <input
                        type="text"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        className="form-control form-control-sm bg-dark text-light"
                        placeholder={`Enter their email...`}
                        />
                        <button type="submit" className="btn btn-success">Go</button>
                    </div>
                </form>
            ) : (
                <>
                <button type="submit"  onClick={() => displayNewCollaboratorForm(true)} className="card bg-dark text-light border-secondary p-2 w-100 mb-2" >
                Add Collaborator
                </button>
                </>
            )
            }

            {/*Render the existing user links.*/}
            {company.users?.length > 0 ? (
            company.users?.slice().reverse().map((user, i) => (
                
                <div className="col-12 mb-1" key={i}>
                {           
                    currentCollaborator != null && currentCollaborator.userId == user.userId ? (
                    
                    <div className="input-group w-100">
                        <div className="btn card flex-fill bg-success btn-sm text-light border-secondary p-2 mb-2" >{currentCollaborator.name}</div>
                        <button className="btn btn-danger btn-sm p-2 mb-2"  type="submit" onClick={() => removeCollaborator(currentCollaborator.userId, company.companyId)}>X</button>
                    </div>
                    ) : 
                (
                    <div className="input-group w-100">
                    <button className="card bg-dark flex-fill text-light border-secondary p-2 mb-2"
                        onClick={() => selectCollaborator(user.userId, company.companyId)}>
                        {user.name}
                    </button>
                    </div>
                )}
                
                </div>
            ))
            ) : (
            <></>
            )
            }
        </div>
    
    );
  };
  
  export default UserManagerLinks;