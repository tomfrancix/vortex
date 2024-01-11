import React, { useState } from 'react';
import { useFormik } from 'formik';
import ProjectLinks from './menu/ProjectLinks';
import UserManagerLinks from './menu/UserManagerLinks';
import Project from './Project';
import UseEnhancedLogger from '../debug/EnhancedLogger';

const Company = ({company, setCompany}) => {
    
  const { debug, info, warn, error } = UseEnhancedLogger('Company');

    const [project, setProject] = useState(null);
    const [collaborator, setCollaborator] = useState(null);
    const [currentTask, setCurrentTask] = useState(null);

    const fetchSteps = async () => {
      console.log("------------Getting steps for project...");
      try {
        const response = await fetch('/api/Step/list', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: currentTask.taskItemId
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log({
            "Fetch steps response data": data
          });
  
          setCurrentTask((prevTask) => {
            // Use the previous state to ensure you're updating based on the current state
            const updatedTask = { ...prevTask, steps: data };
            info("Setting task...");
            info(updatedTask);
            return updatedTask;
          });
        } else {
          error('Failed to fetch tasks:', response.statusText);
        }
      } catch (error) {
        error('Error fetching tasks:', error);
      }
    }

    const setTask = async(task) => {
      setCurrentTask(task)
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