import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import ProjectLinks from './menu/ProjectLinks';
import UserManagerLinks from './menu/UserManagerLinks';
import Project from './Project';
import UseEnhancedLogger from '../debug/EnhancedLogger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const Company = ({ company, setCompany, user }) => {
  const { debug, info, warn, error } = UseEnhancedLogger('Company');

  const [project, setProject] = useState(null);
  const [collaborator, setCurrentCollaborator] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  console.log('loading Company Collaborator', collaborator);
  const setTask = async (task) => {
    setCurrentTask(task);
  };

  useEffect(() => {
    console.log('Company: Set Collaborator', collaborator);
  }, [collaborator]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="container-fluid bg-light" style={{ height: '100vh', display: 'flex', marginTop: '-60px', padding: '60px 0 0 0' }}>
     
        {sidebarCollapsed ? 
        ( 
          <button className="btn btn-dark" onClick={toggleSidebar} style={{borderRadius:"0"}}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        ) 
        : 
        (
          <nav id="sidebar" className={`col-md-3 col-lg-2 d-md-block bg-dark text-light sidebar p-2 fs-6 ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="position-sticky">
            {!sidebarCollapsed ? 
            ( 
              <button className="btn btn-dark" onClick={toggleSidebar}  style={{float:"right", marginTop:"8px"}}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            ):(<></>)} 
              <ProjectLinks company={company} setCompany={setCompany} currentProject={project} setProject={setProject} setTask={setTask} />
              <UserManagerLinks company={company} setCompany={setCompany} currentCollaborator={collaborator} setCollaborator={setCurrentCollaborator} currentUser={user} />
            </div>
          </nav>
        )} 
      
      

      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-1 bg-dark bg-black" style={{ flexGrow: 1}}>
        {project != null ? (
          <Project project={project} setProject={setProject} currentTask={currentTask} setTask={setTask} currentCollaborator={collaborator} setCollaborator={setCurrentCollaborator} />
        ) : (
          <>No project selected</>
        )}
      </main>
    </div>
  );
};

export default Company;