import React, { useState, useEffect, useRef } from 'react';
import UseEnhancedLogger from '../../debug/EnhancedLogger';
import TaskStatusEnum, { TaskStatusValues } from '../../enum/TaskStatusEnum';

const Status = ( {currentTask, setTask, setProject} ) => {
  const { debug, info, warn, error } = UseEnhancedLogger('Task');

  useEffect(() => {
    currentTask.status = currentTask.status;
  }, [currentTask.status])

  const editTask = async (formData) => {
    var url = '/api/taskitem/edit';
    if (formData.field == null) {
      formData.field = document.querySelector('input[name="field"]')?.value 
    }

    info(formData);
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        info(`Setting current task status (${currentTask.status}) to ${data.status}`);
        // currentTask.status = data.status; This doesn't work. React needs a new object entirely, see below.
        const updatedTask = {...currentTask, status: data.status, owner: data.owner}
        setTask(updatedTask);

        setProject((prevProject) => {

          var index = prevProject.tasks.findIndex((task) => task.taskItemId === data.taskItemId)

          prevProject.tasks[index] = currentTask;

          info("Setting project...");
          info(prevProject);
          return prevProject;
        });

        document.getElementById(`status${TaskStatusValues[formData.value]}`.replace(" ", "")).click();
  
      } else {
        error(`Failed to ${url.split('/').pop()}:${response.statusText}`);
      }

    } catch (ex) {
        error(`Error ${url.split('/').pop()}:${ex}`);
    }
  };

  const handleStatusChange = async (index) => {
    console.log(`New status = ${index}`);
    editTask({
      field: "status",
      value: `${index}`,
      taskItemId:currentTask.taskItemId
    });
  }

  return (
      <li className="list-group-item bg-dark text-light border border-secondary">
        <small>Status:</small><br/>
        <div className="d-flex pt-2" style={{flexWrap:"nowrap", fontSize:"8pt"}}>
        {TaskStatusValues.map((status, index) => (
          <React.Fragment key={status}>
            <label className="form-check-label form-check form-check-inline flex-grow-1 text-center d-flex flex-column align-items-center p-1 rounded" htmlFor={`status-${index}`} style={{border:"1px dashed grey", textDecoration:"underline", textDecorationStyle:"dotted" }} role="button">
              <input
                className="mx-1 form-check-input"
                type="radio"
                name="taskItemStatus"
                id={`status-${index}`}
                value={index}
                checked={index === currentTask.status}
                onChange={() => handleStatusChange(index)}
                role="button"
              />
              {TaskStatusValues[index]}
            </label>
          </React.Fragment>
        ))}
        </div>
      </li>
  );
};

export default Status;