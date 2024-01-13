import React, { useState, useEffect, useRef } from 'react';
import UseEnhancedLogger from '../../debug/EnhancedLogger';
import TaskStatusEnum, { TaskStatusValues } from '../../enum/TaskStatusEnum';

const Status = ( {currentTask, setTask, setProject} ) => {
  const { debug, info, warn, error } = UseEnhancedLogger('Task');

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
        setTask(data);

        setProject((prevProject) => {

          var index = prevProject.tasks.findIndex((task) => task.taskItemId === data.taskItemId)

          prevProject.tasks[index] = data;

          info("Setting project...");
          info(prevProject);
          return prevProject;
        });
        
        info(`statusRequested${TaskStatusValues[formData.value]}`);
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
            <div className="form-check form-check-inline flex-grow-1">
              <input
                className="form-check-input"
                type="radio"
                name="taskItemStatus"
                id={`status-${index}`}
                value={index}
                checked={index === currentTask.status}
                onChange={() => handleStatusChange(index)}
                role="button"
              />
              <label className="form-check-label" htmlFor={`status-${index}`} style={{textDecoration:"underline", textDecorationStyle:"dotted"}} role="button">
                {TaskStatusValues[index]}
              </label>
            </div>
          </React.Fragment>
        ))}
        </div>
      </li>
  );
};

export default Status;