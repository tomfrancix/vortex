import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';

const Task = ( {currentTask, setTask, setProject} ) => {
  const [editSummaryFormIsVisible, displayEditSummaryForm] = useState(false);
  const [editDescriptionFormIsVisible, displayEditDescriptionForm] = useState(false);
  const [addStepFormIsVisible, displayAddStepForm] = useState(false);

  const [steps, setSteps] = useState(currentTask.steps);

  var summary = currentTask.summary;
  var description = currentTask.description;
  var taskItemId = currentTask.taskItemId;

  const summaryInputRef = useRef(null); 
  const descriptionInputRef = useRef(null); 
  const stepsInputRef = useRef(null);

  const editTask = async (formData) => {
    var url = '/api/taskitem/edit';
    formData.field = document.querySelector('input[name="field"]').value;

    console.log("EDIT SUMMARY");
    console.log(formData);
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
          const updatedTasks = [...prevProject.tasks, data];

          const updatedProject = { ...prevProject, tasks: updatedTasks };

          console.log("Setting project...");
          console.log(updatedProject);
          return updatedProject;
        });
  
        formikSummary.resetForm();
        formikDescription.resetForm();
  
      } else {
        console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
      }

    } catch (error) {
        console.error(`Error ${url.split('/').pop()}:`, error);
    }
  };

  const addStep = async (formData) => {
    console.log("ADDING STEP");
    console.log(formData);
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
        console.log(currentTask);
        currentTask.steps= [];
        const updatedSteps = [...currentTask.steps, data];
        console.log(updatedSteps);
        setSteps(updatedSteps);
        setTask(currentTask => {
          currentTask.steps = updatedSteps;
          console.log(currentTask);
          return currentTask;
        })
        displayAddStepForm(false);

        formikSteps.resetForm();
  
      } else {
        console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
      }

    } catch (error) {
        console.error(`Error ${url.split('/').pop()}:`, error);
    }
  };

  const formikSummary = useFormik({
    initialValues: {
      taskItemId: currentTask.taskItemId
    },
    onSubmit: values => {
        console.log(values);
        
        editTask(values);
    },
  });

  const formikDescription = useFormik({
    initialValues: {
      taskItemId: currentTask.taskItemId
    },
    onSubmit: values => {
        console.log(values);
        
        editTask(values);
    },
  });

  const formikSteps = useFormik({
    initialValues: {
      taskItemId: currentTask.taskItemId
    },
    onSubmit: values => {
        console.log(values);
        addStep(values);
    },
  });

  useEffect(() => {
    if (summaryInputRef.current) {
      summaryInputRef.current.focus();
    }

    if (editSummaryFormIsVisible) {
      formikSummary.setFieldValue("value", summary);
      summaryInputRef.current.focus();
    }

    if (editDescriptionFormIsVisible) {
      formikDescription.setFieldValue("value", description);
      descriptionInputRef.current.focus();
    }

    if (stepsInputRef.current) {
      stepsInputRef.current.focus();
    }

    fetchSteps();

  }, [editSummaryFormIsVisible, editDescriptionFormIsVisible, addStepFormIsVisible]);

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

        setTask((prevTask) => {
          // Use the previous state to ensure you're updating based on the current state
          const updatedTask = { ...prevTask, steps: data };
          console.log("Setting task...");
          console.log(updatedTask);
          return updatedTask;
        });
      } else {
        console.error('Failed to fetch tasks:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  
  useEffect(() => {
    if (currentTask.steps == []) {
      fetchSteps();
    }
  }, [currentTask.taskItemId]);

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
    if (ref.current) {
      ref.current.focus();
    }
    displayAddStepForm(shouldDisplay);
  };

  return (
    <ul className="list-group ">
      <li className="list-group-item bg-black text-light border border-secondary">
        <small>Summary: # {currentTask.taskitemId}</small><br/>
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
              className="btn btn-sm btn-default text-light"
              style={{ padding:"14px 6px" }}
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
          <div className="form-check form-check-inline flex-grow-1">
            <input className="form-check-input" type="radio" name="taskItemStatus" id="status" value="0" />
            <label className="form-check-label" htmlFor="inlineRadio1">Requested</label>
          </div>
          <div className="form-check form-check-inline flex-grow-1">
            <input className="form-check-input" type="radio" name="taskItemStatus" id="inlineRadio2" value="1" />
            <label className="form-check-label" htmlFor="inlineRadio2">In Progress</label>
          </div>
          <div className="form-check form-check-inline flex-grow-1">
            <input className="form-check-input" type="radio" name="taskItemStatus" id="inlineRadio3" value="2" />
            <label className="form-check-label" htmlFor="inlineRadio3">For Review</label>
          </div>
          <div className="form-check form-check-inline flex-grow-1">
            <input className="form-check-input" type="radio" name="taskItemStatus" id="inlineRadio3" value="3" />
            <label className="form-check-label" htmlFor="inlineRadio3">Completed</label>
          </div>
          <div className="form-check form-check-inline flex-grow-1">
            <input className="form-check-input" type="radio" name="taskItemStatus" id="inlineRadio3" value="4" />
            <label className="form-check-label" htmlFor="inlineRadio3">Archived</label>
          </div>
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
                  className="form-control form-control-sm bg-dark text-light border-0"
                  ></textarea>
                  <button type="submit" className="btn btn-success" style={{ maxHeight:"40px", bottom:0, right:0, marginTop:"40px", position:"absolute"}}>Go</button>
                </div>
            </form>
          ) : (
            <>
            <div
              type="submit"
              onClick={() => displayDescriptionForm(true, currentTask.summary, descriptionInputRef)}
              className="btn btn-sm btn-default text-light"
              style={{ padding:"14px 6px", textAlign:"left"}}
            >
             {currentTask.description == "" ? "Add a description..." : currentTask.description}
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
                  <input
                  ref={summaryInputRef} 
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
            <>
            <div
              type="submit"
              onClick={() => displayStepForm(true, currentTask.steps, stepsInputRef)}
              className="d-flex"
            ><i style={{padding:"10px 10px 0 0"}}>+</i><div className="bg-black py-1 px-2 border-1 mt-2 rounded flex-grow-1" style={{fontSize:"10pt"}}>Add a task</div>
            </div>
          
            </>
          )
        }
          <li className="d-flex"><i style={{padding:"10px 10px 0 0"}}>•</i><div className="bg-black py-1 px-2 border-1 mt-2 rounded flex-grow-1" style={{fontSize:"10pt"}}>Make a list</div></li>
          <li className="d-flex"><i style={{padding:"10px 10px 0 0"}}>•</i><div className="bg-black py-1 px-2 border-1 mt-2 rounded flex-grow-1" style={{fontSize:"10pt"}}>Make a list</div></li>
          <li className="d-flex"><i style={{padding:"10px 10px 0 0"}}>•</i><div className="bg-black py-1 px-2 border-1 mt-2 rounded flex-grow-1" style={{fontSize:"10pt"}}>Make a list</div></li>
          {steps?.slice().reverse().map((step, index) => (
          <>
          {
            step?.status == 1 ? (
              <div  key={step.stepId} type="submit" className="card bg-success text-light p-2 px-3 w-100 mb-2" >
                <i className="bi bi-check-square"></i>{step.summary}
              </div>
            ) : (
              <button key={step.stepId} type="submit" className="card bg-dark text-light p-2 px-3 w-100 mb-2"  onClick={() => setTask(step)}>
                <i className="bi bi-uncheck-square">-</i> {step.summary}
              </button>
            )
          }</>
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