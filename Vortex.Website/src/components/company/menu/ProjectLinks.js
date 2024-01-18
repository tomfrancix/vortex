import React, { useState, useEffect, useRef  } from 'react';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ProjectLinks = ({company, setCompany, currentProject, setProject, setTask}) => {
    const token = localStorage.getItem('accessToken');
    const [newProjectFormIsVisible, displayNewProjectForm] = useState(false);
    const inputRef = useRef(null); 

    useEffect(() => {
        const handleOutsideClick = (event) => {
          // Check if the click is outside the form and if the form is visible
          if (newProjectFormIsVisible && !event.target.closest('.form-project-container')) {
            displayNewProjectForm(false);
            formik.resetForm();
          }
        };

        if (newProjectFormIsVisible) {
            inputRef.current.focus();
          }
    
        // Attach event listener
        document.addEventListener('click', handleOutsideClick);
    
        // Detach event listener on component unmount
        return () => {
          document.removeEventListener('click', handleOutsideClick);
        };
      }, [newProjectFormIsVisible]);

    const createProject = async (formData) => {
        var url = '/api/Project/new';
        
        if (formData.name.length > 0) {
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
                data.tasks = [];
                setTask(null);
                setProject(data);
                displayNewProjectForm(false);
            
                setCompany((prevCompany) => {
                    const updatedProjects = [...prevCompany.projects, data];
            
                    const updatedCompany = { ...prevCompany, projects: updatedProjects };
            
                    return updatedCompany;
                });

                formik.resetForm();
                document.getElementById("statusRequested").click();

                } else {
                console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
                }
            } catch (error) {
                console.error(`Error ${url.split('/').pop()}:`, error);
            }
        }
    };

    const selectProject = async (id) => {
        setProject(null);
        var url = '/api/Project/read'
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
            const project = await response.json();
            project.tasks = [];
            setTask(null)
            setProject(project);
            displayNewProjectForm(false);
            document.getElementById("statusRequested").click();
        } else {
            console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
        }
    };

    const deleteProject = async (id) => {

        var url = '/api/Project/delete'

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
        setProject(null);
        setCompany((prevCompany) => {
            const updatedProjects = prevCompany.projects.filter(
            (project) => project.projectId !== id
            );

            const updatedCompany = { ...prevCompany, projects: updatedProjects };
    
            return updatedCompany;
        });
        } else {
        console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
        }
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            companyId: company.companyId
        },
        onSubmit: values => {
            values.companyId = company.companyId;
            createProject(values);
        },
    });

    return (
        <div className="py-4">
            <h2 className="fs-6">Projects</h2>
            <hr/>

            {/*Render the option to create a new project.*/}
            {
            newProjectFormIsVisible ? (
                <form onSubmit={formik.handleSubmit} className="form-project-container">
                    <div className="input-group mb-2 fs-6">
                    <input
                    ref={inputRef}
                    type="text"
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    className="form-control form-control-sm bg-dark text-light"
                    placeholder={`Name the project...`}
                    />
                    </div>
                    <button type="submit" style={{display:"none"}}></button>
                </form>
            ) : (
                <>
                <button type="submit"  
                    onClick={() => displayNewProjectForm(true)} 
                    className="card bg-dark text-light border-secondary p-2 w-100 mb-2"
                    style={{border:"1px dashed grey", flexDirection:"row"}} >
                    <div>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <span className="px-2">Add Project</span>
                </button>
                </>
            )
            }

            {/*Render the existing project links.*/}
            {company.projects?.length > 0 ? (
            company.projects?.slice().reverse().map((project, i) => (
                
                <div className="col-12 mb-1" key={i}>
                {           
                    currentProject != null && currentProject.projectId == project.projectId ? (
                    
                    <div className="input-group w-100">
                        <div className="btn card flex-fill bg-secondary btn-sm text-light border-secondary p-2 mb-2" style={{textAlign:"left"}}>{currentProject.name}</div>
                        <button className="btn btn-danger btn-sm p-2 mb-2"  type="submit" onClick={() => deleteProject(currentProject.projectId)}>X</button>
                    </div>
                    ) : 
                (
                    <div className="input-group w-100">
                    <button className="card bg-dark flex-fill text-light border-secondary p-2 mb-2" 
                        onClick={() => selectProject(project.projectId)}>
                        {project.name}
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
  
  export default ProjectLinks;