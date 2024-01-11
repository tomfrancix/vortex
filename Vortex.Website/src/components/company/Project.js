import React, { useState, useEffect, useRef } from 'react';
import Tasks from './Tasks';
import Task from './Task';
import { useFormik } from 'formik';
import TaskStatusEnum, { TaskStatusValues } from '../enum/TaskStatusEnum';

const Project = ({project, setProject, currentTask, setTask}) => {
  
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className=" p-2 px-3 my-2 rounded text-light">
            <h3>{project.name}</h3>
            <hr/>
            <div className="container-fluid" style={{fontSize:"9pt"}}>
              <div className="row">

                {/* The list of tasks. */}
                <div className="col-6">
                <ul className="nav nav-pills d-flex flex-row pb-3" style={{fontSize:"8pt"}}>
                {TaskStatusValues.map((status, index) => (
                    <React.Fragment key={status}>
                      <li className="nav-item flex-grow-1 text-center">
                        <a className="nav-link text-light p-1 mb-1" data-bs-toggle="pill" href={`#${TaskStatusValues[index].replace(" ", "")}`}>{TaskStatusValues[index]}</a>
                        <div className={`badge fs-7 pill-${TaskStatusValues[index].replace(" ", "")} text-dark`}>{project?.tasks?.filter(task => task.status === index).length}</div>
                      </li>                     
                    </React.Fragment>
                  ))}
                </ul>
                  <Tasks project={project} setProject={setProject} setTask={setTask} currentTask={currentTask} />
                </div>
                {/* The selected task details. */}
                <div className="col-6">
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