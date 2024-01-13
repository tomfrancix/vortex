import React from 'react';
import Summary from './task/Summary';
import Status from './task/Status';
import Description from './task/Description';
import Steps from './task/Steps';
import Comments from './task/Comments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Task = ( {currentTask, setTask, setProject} ) => {
  
  return (
    <ul className="list-group ">
      <li className="list-group-item bg-dark text-light border border-secondary">
        <small>
        ID: #{currentTask.taskItemId}
        | Created By: <div className="badge bg-secondary fs-7">{currentTask.creator}</div> 
        {currentTask.owner.length > 0 ? <span> | Owner: <div className="badge bg-secondary fs-7">{currentTask.owner}</div></span> : "" }
        </small>
        <button className="btn btn-sm btn-default deleteButton py-0 m-0" style={{float:"right"}}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </li>
      <Summary currentTask={currentTask} setTask={setTask} setProject={setProject}/>
      <Status currentTask={currentTask} setTask={setTask} setProject={setProject}/>
      <Description currentTask={currentTask} setTask={setTask} setProject={setProject} />
      <Steps currentTask={currentTask} setTask={setTask} setProject={setProject}  />
      <Comments currentTask={currentTask} setTask={setTask} />
    </ul>
  );
};

export default Task;