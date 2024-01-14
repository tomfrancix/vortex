import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faPlus } from '@fortawesome/free-solid-svg-icons';

const UserManagerLinks = ({company, setCompany, currentCollaborator, setCollaborator, currentUser}) => {
    const token = localStorage.getItem('accessToken');
    const [newCollaboratorFormIsVisible, displayNewCollaboratorForm] = useState(false);
    const inputRef = useRef(null); 
    
    useEffect(() => {
        console.log("UserManagerLinks: Using effect", currentCollaborator);
    }, [currentCollaborator]);

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

    const selectCollaborator = async (collaborator) => {
        console.log("UserManagerLinks: Set Collaborator", collaborator)
        setCollaborator({...collaborator});
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

    const UserLink = ({currentUser, user, company, selectCollaborator}) => {
        return (
            <div className="input-group w-100">
                <button className="card flex-fill text-light border-secondary p-1 mt-1 bg-blue d-flex flex-row"
                    onClick={() => selectCollaborator(user)}>
                    <div><FontAwesomeIcon icon={faUser} /></div>
                    {           
                    
                        currentUser.userName == user.userName ? (
                            <div className="mx-1">
                                YOU: {user.firstName} {user.lastName}
                            </div>
                        ) 
                        : 
                        (
                            <div className="mx-1">
                                <strong></strong>{user.firstName} {user.lastName}
                            </div>
                        )
                    }
                </button>
            </div>
        )
      }

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
                <button type="submit"  onClick={() => displayNewCollaboratorForm(true)} className="card bg-dark text-light border-secondary p-2 w-100 mb-2" 
                    style={{border:"1px dashed grey", flexDirection:"row"}} >
                    <div>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <span className="px-2">Invite by Email</span>
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
                company.users?.map((user, i) => (
                    
                    <div className="col-12 mb-1" key={i}>
                        {           
                            i == 0 ? (
                                <>
                                <small className="">Administrator</small>
                                <UserLink currentUser={currentUser} user={user} company={company} selectCollaborator={selectCollaborator}/>
                                <br/>
                                </>
                            ) : (<></>)
                        }

                        {           
                            i == 1 ? (
                                <small className="">Existing Members</small>
                            ) : (<></>)
                        }
                        
                        {           
                            i >= 1 ? (
                                <UserLink currentUser={currentUser} user={user} company={company} selectCollaborator={selectCollaborator}/>
                            ) : (<></>)
                        }

                        
                    </div>
                ))) : (<></>)
            }
        </div>
    
    );
  };
  
  export default UserManagerLinks;