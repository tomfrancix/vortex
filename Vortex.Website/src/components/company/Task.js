import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import UseEnhancedLogger from '../debug/EnhancedLogger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import TaskStatusEnum, { TaskStatusValues } from '../enum/TaskStatusEnum';

const Task = ( {currentTask, setTask, setProject} ) => {
  const { debug, info, warn, error } = UseEnhancedLogger('Task');

  const [editSummaryFormIsVisible, displayEditSummaryForm] = useState(false);
  const [editDescriptionFormIsVisible, displayEditDescriptionForm] = useState(false);
  const [addStepFormIsVisible, displayAddStepForm] = useState(false);

  var summary = currentTask.summary;
  var description = currentTask.description;

  const summaryInputRef = useRef(null); 
  const descriptionInputRef = useRef(null); 
  const stepsInputRef = useRef(null);

  const editTask = async (formData) => {
    var url = '/api/taskitem/edit';
    if (formData.field == null) {
      formData.field = document.querySelector('input[name="field"]')?.value 
    }

    info("EDIT SUMMARY");
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
        displayEditSummaryForm(false);
        displayEditDescriptionForm(false);

        setProject((prevProject) => {

          var index = prevProject.tasks.findIndex((task) => task.taskItemId === data.taskItemId)

          prevProject.tasks[index] = data;

          info("Setting project...");
          info(prevProject);
          return prevProject;
        });
  
        formikSummary.resetForm();
        formikDescription.resetForm();
  
      } else {
        error(`Failed to ${url.split('/').pop()}:${response.statusText}`);
      }

    } catch (ex) {
        error(`Error ${url.split('/').pop()}:${ex}`);
    }
  };

  const addStep = async (formData) => {
    info("ADDING STEP");
    info(currentTask);
    info(formData);
    var url = '/api/step/new';
    
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
        if (currentTask.steps == null) {
          currentTask.steps = [];
        }
        info(currentTask);
        const updatedSteps = [...currentTask.steps, data];
        info(updatedSteps);
        setTask(currentTask => {
          currentTask.steps = updatedSteps;
          info(currentTask);
          return currentTask;
        })
        displayAddStepForm(false);

        formikSteps.resetForm();
  
      } else {
        error(`Failed to ${url.split('/').pop()}:${response.statusText}`);
      }

    } catch (ex) {
        error(`Error ${url.split('/').pop()}:${ex}`);
    }
  };

  const formikSummary = useFormik({
    initialValues: {
      taskItemId: currentTask.taskItemId
    },
    onSubmit: values => {
        info(values);
        
        editTask(values);
    },
  });

  const formikDescription = useFormik({
    initialValues: {
      taskItemId: currentTask.taskItemId
    },
    onSubmit: values => {
        info(values);
        editTask(values);
    },
  });

  const formikSteps = useFormik({
    initialValues: {
      taskItemId: currentTask.taskItemId,
      content: ''
    },
    onSubmit: values => {
      info("VALUES")
      info(values);
      info(currentTask);
      addStep(values);
    },
  });

  useEffect(() => {
    if (editSummaryFormIsVisible) {
      formikSummary.setFieldValue("value", currentTask.summary);
      summaryInputRef.current.focus();
    }
  }, [editSummaryFormIsVisible, currentTask.summary]);
  
  useEffect(() => {
    if (editDescriptionFormIsVisible) {
      formikDescription.setFieldValue("value", currentTask.description);
      descriptionInputRef.current.focus();
    }
    const updateTextAreaHeight = () => {
      if (editDescriptionFormIsVisible && descriptionInputRef.current) {
        const lines = descriptionInputRef.current.value.split('\n').length;
        const newHeight = `${lines * 1.5 + 2}em`;
        descriptionInputRef.current.style.height = newHeight;
      }
    };

    descriptionInputRef.current?.addEventListener('input', updateTextAreaHeight);

    return () => {
      descriptionInputRef.current?.removeEventListener('input', updateTextAreaHeight);
    };
  }, [editDescriptionFormIsVisible, currentTask.description]);

  useEffect(() => {
    if (summaryInputRef.current) {
      summaryInputRef.current.focus();
    }
  }, [summaryInputRef]);

  useEffect(() => {
    if (addStepFormIsVisible) {
      formikSteps.setFieldValue("taskItemId", currentTask.taskItemId);
      stepsInputRef.current.focus();
    }
  }, [addStepFormIsVisible, currentTask.steps]);

  const displaySummaryForm = (shouldDisplay, currentValue, ref) => {
    if (ref.current) {
      ref.current.focus();
      formikSummary.setFieldValue("value", currentValue);
    }
    displayEditSummaryForm(shouldDisplay);
  };
  
  const displayDescriptionForm = (shouldDisplay, currentValue, ref) => {
    if (ref.current) {
      ref.current.focus();
      formikDescription.setFieldValue("value", currentValue);
    }
    displayEditDescriptionForm(shouldDisplay);
  };
  
  const displayStepForm = (shouldDisplay, currentValue, ref) => {
    info("currentTask");
    info(currentTask);
    if (ref.current) {
      ref.current.focus();
    }
    displayAddStepForm(shouldDisplay);
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
    <ul className="list-group ">
      <li className="list-group-item bg-dark text-light border border-secondary">
        <small>
        ID: #{currentTask.taskItemId} | Created By: <div className="badge bg-secondary fs-7">{currentTask.creator}</div> | at: {currentTask.creato}
        </small>
      </li>
      <li className="list-group-item bg-black text-light border border-secondary">
        <small>Summary:</small><br/>
        {
          editSummaryFormIsVisible ? (
            <form onSubmit={formikSummary.handleSubmit}>
                <div className="input-group mb-2 fs-6 text-light mt-2">

                  <input type="hidden" name="field" id="field" value="summary" />
                  <input
                  ref={summaryInputRef} 
                  type="text"
                  id="value"
                  name="value"
                  onChange={formikSummary.handleChange}
                  value={formikSummary.values.value}
                  className="form-control form-control-sm bg-dark text-light border-0"
                  placeholder={`Summarise the task...`}
                  />
                  <button type="submit" className="btn btn-success">Go </button>
                </div>
            </form>
          ) : (
            <>
            <button
              type="submit"
              onClick={() => displaySummaryForm(true, currentTask.summary, summaryInputRef)}
              className="btn btn-sm btn-default"
              style={{ padding:"14px 6px", fontWeight:"bold", color:"hotpink"}}
            >
              {currentTask.summary} {currentTask.taskitemId}
            </button>
            </>
          )
        }
      </li>
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
                onChange={() => handleStatusChange(index)} // Add a function to handle the change
              />
              <label className="form-check-label" htmlFor={`status-${index}`}>
                {TaskStatusValues[index]}
              </label>
            </div>
          </React.Fragment>
        ))}
        </div>
      </li>
      <li className="list-group-item bg-black text-light border border-secondary">
        <small>Description:</small><br/>
        {
          editDescriptionFormIsVisible ? (
            <form onSubmit={formikDescription.handleSubmit}>
                <div className="input-group mb-2 fs-6  text-light mt-2">

                  <input type="hidden" name="field" id="field" value="description" />
                  <textarea
                  ref={descriptionInputRef} 
                  type="text"
                  id="value"
                  name="value"
                  onChange={formikDescription.handleChange}
                  value={formikDescription.values.value}
                  className="form-control form-control-sm bg-dark text-light border-0 mb-5"
                  style={{height: `${(currentTask.description.match(/\n/g) || []).length * 1.5 + 3}em`}}
                  ></textarea>
                  <button type="submit" className="btn btn-success" style={{ maxHeight:"40px", bottom:"0px", right:0, marginTop:"40px", position:"absolute"}}>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </div>
            </form>
          ) : (
            <>
            <div
              type="submit"
              onClick={() => displayDescriptionForm(true, currentTask.description, descriptionInputRef)}
              className="btn btn-sm btn-default text-light w-100"
              style={{ padding:"14px 6px", textAlign:"left", whiteSpace: "pre-line", height: `${(currentTask.description.match(/\n/g) || []).length * 1.5 + 3}em` }}
            >
             <p>{currentTask.description == "" ? "Add a description..." : currentTask.description}</p>
            </div>
            </>
          )
        }
      </li>
      <li className="list-group-item bg-dark text-light border border-secondary">
        <small>Steps:</small><br/>
        <ul className="steps p-0 m-0">
          {
          addStepFormIsVisible ? (
            <form onSubmit={formikSteps.handleSubmit}>
              <i className="	glyphicon glyphicon-unchecked" ></i>
                <div className="input-group mb-2 fs-6  text-light mt-2">
                  <input type="hidden" value={currentTask.taskItemId} />
                  <input
                  ref={stepsInputRef} 
                  type="text"
                  id="content"
                  name="content"
                  onChange={formikSteps.handleChange}
                  value={formikSteps.values.content}
                  className="form-control form-control-sm bg-dark text-light border-0"
                  placeholder={`Enter text...`}
                  />
                  <button type="submit" className="btn btn-success">Go</button>
                </div>
            </form>
          ) : (
            <button type="submit"  
              onClick={() => displayStepForm(true, currentTask.steps, stepsInputRef)} 
              className="card bg-dark text-light border-secondary p-2 mt-2 w-100 mb-2"
              style={{border:"1px dashed grey", flexDirection:"row"}} >
              <div>
                  <FontAwesomeIcon icon={faPlus} />
              </div>
              <span className="px-2">Add Step</span>
            </button>
          )
        }

          {currentTask.steps?.slice().reverse().map((step, index) => (
            <React.Fragment key={step.stepId}>
            {
              <li className="d-flex">
                <i style={{padding:"10px 10px 0 0"}}>•</i>
                <div className="bg-black py-1 px-2 border-1 mt-2 rounded flex-grow-1" style={{fontSize:"10pt"}}>
                  {step.content}
                </div>
                <form className="p-2 pt-3">
                  <input type="checkbox" defaultChecked value="1" name="status"/>
                </form>
              </li>
            }
            </React.Fragment>
          ))}
        </ul>
      </li>
      <li className="list-group-item bg-black text-light border border-secondary">
        <small>Comments:</small><br/>
        <ul>
          <li className="bg-grey p-1">Make a list</li>
          <li>Check it twice</li>
        </ul>
      </li>
    </ul>
  );
};

export default Task;