import React, { useState, useEffect, useRef } from 'react';
import Tasks from './Tasks';
import Task from './Task';
import { useFormik } from 'formik';
import TaskStatusEnum, { TaskStatusValues } from '../enum/TaskStatusEnum';

const Project = ({project, setProject, currentTask, setTask, currentCollaborator, setCollaborator }) => {
  
  console.log("loading Project Collaborator", currentCollaborator);
  useEffect(() => {
    console.log("current Project Collaborator", currentCollaborator);
}, [currentCollaborator]);

  return (
    <div>
      <div className="container-fluid" style={{overflow:"hidden"}}>
        <div className="row">
          <div className="p-2 px-3 my-2 rounded text-light">
            <div className="w-100 d-flex flex-row">
              <h3 className="pt-1 pb-0 mb-0 flex-grow-1">{project.name}</h3>
              <div className="input-group w-auto">
                <button className="btn btn-sm btn-secondary" onClick={() => setProject(null)}>Project Settings</button>
                <button className="btn btn-sm btn-secondary" onClick={() => setProject(null)}>Close</button>
              </div>
            </div>
            <hr/>
            <div className="container-fluid" style={{fontSize:"9pt"}}>
              <div className="row">
                

                {/* The list of tasks. */}
                <div className="col-md-6 p-1">

                  {
                    currentCollaborator != null ? (
                      <div className="rounded p-2 bg-dark text-light mb-2 d-flex flex-row" style={{border:"1px solid rgba(255,255,255,0.1)"}}>
                        <h4 className="m-0 flex-grow-1"><small>{currentCollaborator.firstName} {currentCollaborator.lastName}'s Tasks</small></h4>
                        <button onClick={() => setCollaborator(null)} className="btn btn-sm btn-secondary">View All Tasks</button>
                      </div>
                    ) :(<></>)
                  }

                  <div className="rounded pt-2 pb-0 bg-dark" style={{border:"1px solid rgba(255,255,255,0.1)"}}>
                    <ul className="p-1 nav nav-pills d-flex flex-row pb-3" style={{fontSize:"8pt"}}>
                    {TaskStatusValues.map((status, index) => (
                        <React.Fragment key={status}>
                          <li className="nav-item flex-grow-1 text-center">
                            <a className="nav-link text-light p-1 mb-1" data-bs-toggle="pill" id={`status${TaskStatusValues[index].replace(" ", "")}`} href={`#${TaskStatusValues[index].replace(" ", "")}`}>{TaskStatusValues[index]}</a>
                            <div className={`badge fs-6 pill-${TaskStatusValues[index].replace(" ", "")} text-dark`} style={{paddingTop:"2px"}}>{project?.tasks?.filter(task => task.status === index && (currentCollaborator != null ? (task.creator === currentCollaborator.userName || task.owner === currentCollaborator.userName) : task))
                    .length}</div>
                          </li>                     
                        </React.Fragment>
                      ))}
                    </ul>
                    <Tasks project={project} setProject={setProject} setTask={setTask} currentTask={currentTask} currentCollaborator={currentCollaborator}/>
                  </div>
                </div>
                {/* The selected task details. */}
                <div className="col-md-6 p-1">
                  {
                    currentTask != null ? (
                      <Task setProject={setProject} currentTask={currentTask} setTask={setTask}/>
                    ) : (<></>)
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;