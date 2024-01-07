import React, { useState } from 'react';
import { useFormik } from 'formik';
import InputField from '../auth/InputField';
import Tasks from './Tasks';

const CompanyView = ({company, setCompany}) => {

    const [currentProject, setProject] = useState(null);
    const [currentTask, setTask] = useState(null);
    const [newProjectFormIsVisible, displayNewProjectForm] = useState(false);

    const token = localStorage.getItem('accessToken');
    const getProject = async (url, id) => {
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
    
            return response;
        } catch (error) {
            console.error(`Error ${url.split('/').pop()}:`, error);
        }
    };


    const chooseProject = async (id) => {
      setProject(null);
      var url = '/api/Project/read'
      var response = await getProject(url, id);

      if (response.ok) {
        const data = await response.json();
        setProject(data);
        displayNewProjectForm(false)
      } else {
        console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
      }
    };

    const newProject = async (url, id) => {
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

          return response;

      } catch (error) {
          console.error(`Error ${url.split('/').pop()}:`, error);
      }
  };

  const createProject = async (formData) => {
    var url = '/api/Project/new';
  
    try {
      const response = await newProject(url, formData);
  
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        displayNewProjectForm(false);
  
        setCompany((prevCompany) => {
          const updatedProjects = [...prevCompany.projects.$values, data];
  
          const updatedCompany = { ...prevCompany, projects: { $values: updatedProjects } };
  
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

    const dropProject = async (url, id) => {
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
          
          return response;
      } catch (error) {
          console.error(`Error ${url.split('/').pop()}:`, error);
      }
  };

    const deleteProject = async (id) => {
      var url = '/api/Project/delete'
        var response = await dropProject('/api/Project/delete', id);
        if (response.ok) {
          setProject(null);
          setCompany((prevCompany) => {
            const updatedProjects = prevCompany.projects.$values.filter(
              (project) => project.projectId !== id
            );

            const updatedCompany = { ...prevCompany, projects: { $values: updatedProjects } };
    
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
            createProject(values);
        },
    });

    return (
      <div className="container-fluid bg-light" style={{ height: '100vh', display: 'flex', marginTop: '-60px', padding:'60px 0 0 0'}}>
        <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-dark text-light sidebar p-2 fs-6">
        <div className="position-sticky">
                <div className="py-4">
                  <h2 className="fs-6">Projects</h2>
                  <hr/>
                  {
                    newProjectFormIsVisible ? (
                      <form onSubmit={formik.handleSubmit}>
                          <div className="input-group mb-2 fs-6">
                            <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            className="form-control form-control-sm bg-dark text-light"
                            placeholder={`Name the project...`}
                            />
                            <button type="submit" className="btn btn-success">Go</button>
                          </div>
                      </form>
                    ) : (
                      <>
                      <button type="submit"  onClick={() => displayNewProjectForm(true)} className="card bg-dark text-light border-secondary p-2 w-100 mb-2" >
                        Add Project
                      </button>
                      </>
                    )
                  }
                  {company.projects.$values?.length > 0 ? (
                    company.projects.$values.map((project, i) => (
                      
                        <div className="col-12 mb-1" key={i}>
                        {           
                          currentProject != null && project.projectId == currentProject.projectId ? (
                            
                            <div className="input-group w-100">
                              <div className="btn card flex-fill bg-success btn-sm text-light border-secondary p-2 mb-2" >{project.name}</div>
                              <button className="btn btn-danger btn-sm p-2 mb-2"  type="submit" onClick={() => deleteProject(project.projectId)}>X</button>
                            </div>
                          ) : 
                        (
                          <div className="input-group w-100">
                            <button className="card bg-dark flex-fill text-light border-secondary p-2 mb-2"
                              onClick={() => chooseProject(project.projectId)}>
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
              </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-dark tertiary-bg " style={{ flexGrow: 1, overflowY: 'auto' }}>
          {
            currentProject != null ? (
              <div>
                <div className="container-fluid">
                  <div className="row">
                    <div className=" p-2 px-3 my-2 rounded text-light">
                      <h3>{currentProject.name}</h3>
                      <hr/>
                      <div class="container-fluid">
                        <div className="row">
                          <div class="col-6 font-monospace">
                            <Tasks project={currentProject} setTask={setTask} setProject={setProject} currentTask={currentTask}/>
                          </div>
                          {
                            currentTask != null ? (
                              <div class="col-6">
                                <ul class="list-group ">
                                  <li class="list-group-item bg-black text-light border border-secondary">
                                    <small>Summary:</small><br/>
                                    <span style={{color:"chartreuse"}} >{currentTask.summary}</span>
                                  </li>
                                  <li class="list-group-item bg-dark text-light border border-secondary">
                                    <small>Description:</small><br/>
                                    {currentTask.summary} This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the  tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
                                  </li>
                                  <li class="list-group-item bg-black text-light border border-secondary">
                                    <small>Steps:</small><br/>
                                    <ul>
                                      <li>Make a list</li>
                                      <li>Check it twice</li>
                                    </ul>
                                  </li>
                                  <li class="list-group-item bg-black text-light border border-secondary">
                                    <small>Comments:</small><br/>
                                    <ul>
                                      <li>Make a list</li>
                                      <li>Check it twice</li>
                                    </ul>
                                  </li>
                                </ul>
                              </div>
                            ) : (<></>)
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (<>No project selected</>)
          }
        </main>
      </div>
    
    );
  };
  
  export default CompanyView;