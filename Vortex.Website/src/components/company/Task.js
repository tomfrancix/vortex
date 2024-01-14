import React from 'react';
import Summary from './task/Summary';
import Status from './task/Status';
import Description from './task/Description';
import Steps from './task/Steps';
import Comments from './task/Comments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ScrollableElement from './ScrollableElement';

const Task = ( {currentTask, setTask, setProject} ) => {
  const token = localStorage.getItem('accessToken');

  const deleteTask = async (id) => {

    var url = '/api/TaskItem/delete'

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
    setTask(null);
    setProject((prevProject) => {
        const updatedTasks = prevProject.tasks.filter(
        (task) => task.taskItemId !== id
        );

        const updatedProject = { ...prevProject, tasks: updatedTasks };

        return updatedProject;
      });
    } else {
      console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
    }
  };

  return (
      <ul className="list-group" style={{marginBottom:"400px"}}>
      <li className="list-group-item bg-dark text-light border border-secondary">
        <small>
        ID: #{currentTask.taskItemId}
        | Created By: <div className="badge bg-secondary fs-7">{currentTask.creator}</div> 
        {currentTask.owner.length > 0 ? <span> | Owner: <div className="badge bg-secondary fs-7">{currentTask.owner}</div></span> : "" }
        </small>
        <button className="btn btn-sm btn-default deleteButton py-0 m-0" style={{float:"right"}} onClick={() => deleteTask(currentTask.taskItemId)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </li>
    <ScrollableElement >
      <Summary currentTask={currentTask} setTask={setTask} setProject={setProject}/>
      <Status currentTask={currentTask} setTask={setTask} setProject={setProject}/>
      <Description currentTask={currentTask} setTask={setTask} setProject={setProject} />
      <Steps currentTask={currentTask} setTask={setTask} setProject={setProject}  />
      <Comments currentTask={currentTask} setTask={setTask} />
    </ScrollableElement>
    </ul>
  );
};

export default Task;