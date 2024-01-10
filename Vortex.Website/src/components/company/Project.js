import React, { useState, useEffect, useRef } from 'react';
import Tasks from './Tasks';
import Task from './Task';
import { useFormik } from 'formik';

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
                  <li className="nav-item flex-grow-1 text-center">
                    <a className="nav-link text-light p-1 active" data-bs-toggle="pill" href="#requested">Requested</a>
                  </li>
                  <li className="nav-item  flex-grow-1 text-center">
                    <a className="nav-link text-light p-1" data-bs-toggle="pill" href="#inProgress">In Progress</a>
                  </li>
                  <li className="nav-item  flex-grow-1 text-center">
                    <a className="nav-link text-light p-1" data-bs-toggle="pill" href="#forReview">Pending Review</a>
                  </li>
                  <li className="nav-item  flex-grow-1 text-center">
                    <a className="nav-link text-light p-1" data-bs-toggle="pill" href="#completed">Completed</a>
                  </li>
                  <li className="nav-item  flex-grow-1 text-center">
                    <a className="nav-link text-light p-1" data-bs-toggle="pill" href="#archived">Archived</a>
                  </li>
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