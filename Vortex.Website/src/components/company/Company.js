import React, { useState } from 'react';
import { useFormik } from 'formik';
import ProjectLinks from './menu/ProjectLinks';
import UserManagerLinks from './menu/UserManagerLinks';
import Project from './Project';

const Company = ({company, setCompany}) => {

    const [project, setProject] = useState(null);
    const [collaborator, setCollaborator] = useState(null);
    const [currentTask, setCurrentTask] = useState(null);

    const setTask = async(task) => {
      setCurrentTask(task);
    }
  
    return (
      <div className="container-fluid bg-light" style={{ height: '100vh', display: 'flex', marginTop: '-60px', padding:'60px 0 0 0'}}>
        <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-dark text-light sidebar p-2 fs-6">
          <div className="position-sticky">
               <ProjectLinks company={company} setCompany={setCompany} currentProject={project} setProject={setProject} setTask={setTask}/> 
               <UserManagerLinks company={company} setCompany={setCompany} currentCollaborator={collaborator} setCollaborator={setCollaborator} />
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-dark tertiary-bg " style={{ flexGrow: 1, overflowY: 'auto' }}>
          {
            project != null ? (
              <Project project={project} setProject={setProject} currentTask={currentTask} setTask={setTask}/>
            ) : (<>No project selected</>)
          }
        </main>
      </div>
    
    );
  };
  
  export default Company;