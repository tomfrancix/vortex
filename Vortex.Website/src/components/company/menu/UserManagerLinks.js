import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';

const UserManagerLinks = ({company, setCompany, currentCollaborator, setCollaborator}) => {
    const token = localStorage.getItem('accessToken');
    const [newCollaboratorFormIsVisible, displayNewCollaboratorForm] = useState(false);
    const inputRef = useRef(null); 
    
    useEffect(() => {
        const handleOutsideClick = (event) => {
          // Check if the click is outside the form and if the form is visible
          if (newCollaboratorFormIsVisible && !event.target.closest('.form-collaborator-container')) {
            displayNewCollaboratorForm(false);
            formik.resetForm();
          }
        };

        if (newCollaboratorFormIsVisible) {
            inputRef.current.focus();
          }
    
        // Attach event listener
        document.addEventListener('click', handleOutsideClick);
    
        // Detach event listener on component unmount
        return () => {
          document.removeEventListener('click', handleOutsideClick);
        };
      }, [newCollaboratorFormIsVisible]);

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
                const updatedCollaborators = [...prevCompany.invitations, data];
        
                const updatedCompany = { ...prevCompany, invitations: updatedCollaborators };
        
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
            email: ''
        },
        onSubmit: values => {
            values.companyId = company.companyId;
            addCollaborator(values);
        }
    });

    return (
        <div className="py-4">
            <h2 className="fs-6">Collaborators</h2>
            <hr/>
            
            {/*Render the option to add a new collaborator.*/}
            {
            newCollaboratorFormIsVisible ? (
                <form onSubmit={formik.handleSubmit} className="form-collaborator-container">
                    <div className="input-group mb-2 fs-6">
                        <input type="hidden" name="companyId" value={company.companyId} />
                        <input
                        ref={inputRef}
                        type="text"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        className="form-control form-control-sm bg-dark text-light"
                        placeholder={`Enter their email...`}
                        />
                    </div>
                    <button type="submit" style={{display:"none"}}></button>
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
            {
                company.invitations?.length > 0 ? (
                    company.invitations?.slice().reverse().map((invitation, i) => (
                        
                        <div className="col-12 mb-1" key={i}>
                            {           
                                i == 0 ? (
                                    <small className=""><br />Invitations</small>
                                ) : (<></>)
                            }
                            <div className="card flex-fill text-light border-secondary p-1 mt-1 bg-purple d-flex flex-row">
                                <div><FontAwesomeIcon icon={faEnvelope} /></div>
                                <div className="mx-1">{invitation.email}</div>
                            </div>
                        </div>
                    ))
                ) : (<></>)
            }

<br />
            {/*Render the existing user links.*/}
            {company.users?.length > 0 ? (
                company.users?.slice().reverse().map((user, i) => (
                    
                    <div className="col-12 mb-1" key={i}>
                        {           
                            i == 0 ? (
                                <small className="">Existing Members</small>
                            ) : (<></>)
                        }
                        <div className="input-group w-100">
                            <button className="card flex-fill text-light border-secondary p-1 mt-1 bg-blue d-flex flex-row"
                                onClick={() => selectCollaborator(user.userId, company.companyId)}>
                                <div><FontAwesomeIcon icon={faUser} /></div>
                                {           
                                
                                    currentCollaborator != null && currentCollaborator.userId == user.userId ? (
                                    
                                                <div className="mx-1">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                    ) 
                                    : 
                                    (
                                        
                                                <div className="mx-1">
                                                    <strong>YOU: </strong>{user.firstName} {user.lastName}
                                                </div>
                                    )
                                }
                            </button>
                        </div>
                    </div>
                ))) : (<></>)
            }
        </div>
    
    );
  };
  
  export default UserManagerLinks;