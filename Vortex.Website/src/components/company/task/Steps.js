import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import UseEnhancedLogger from '../../debug/EnhancedLogger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Steps.css';
import Status from './steps/Status';

const Steps = ({currentTask, setTask, setProject}) => {
    const { debug, info, warn, error } = UseEnhancedLogger('Steps');
    const [addStepFormIsVisible, displayAddStepForm] = useState(false);
    const stepsInputRef = useRef(null);
    const token = localStorage.getItem('accessToken');
    
    useEffect(() => {
      const handleOutsideClick = (event) => {
        // Check if the click is outside the form and if the form is visible
        if (addStepFormIsVisible && !event.target.closest('.form-steps-container')) {
          displayAddStepForm(false);
          formikSteps.resetForm();
        }
      };
  
      // Attach event listener
      document.addEventListener('click', handleOutsideClick);
  
      // Detach event listener on component unmount
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }, [addStepFormIsVisible]);

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
            displayStepForm(true, currentTask.steps, stepsInputRef);
    
            formikSteps.resetForm();
      
          } else {
            error(`Failed to ${url.split('/').pop()}:${response.statusText}`);
          }
    
        } catch (ex) {
            error(`Error ${url.split('/').pop()}:${ex}`);
        }
    };

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
      if (addStepFormIsVisible) {
        formikSteps.setFieldValue("taskItemId", currentTask.taskItemId);
        stepsInputRef.current.focus();
      }
    }, [addStepFormIsVisible, currentTask.steps]);
    
    const displayStepForm = (shouldDisplay, currentValue, ref) => {
        info("currentTask");
        info(currentTask);
        if (ref.current) {
            ref.current.focus();
        }
        displayAddStepForm(shouldDisplay);
    };

    const deleteStep = async (id) => {

      var url = '/api/Step/delete'
  
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
      setTask((prevTask) => {
          const updatedSteps = prevTask.steps.filter(
          (step) => step.stepId !== id
          );
  
          const updatedTask = { ...prevTask, steps: updatedSteps };
  
          return updatedTask;
        });
      } else {
        console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
      }
    };
    

    return (
        <li className="list-group-item bg-dark text-light border border-secondary">
            <small>Steps:</small><br/>
            <ul className="steps p-0 m-0">
            {
            addStepFormIsVisible ? (
                <form onSubmit={formikSteps.handleSubmit} className="form-steps-container">
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
                    </div>
                    <button type="submit" style={{display:"none"}}></button>
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
                     <button className="btn btn-sm btn-default deleteButton px-0" onClick={() => deleteStep(step.stepId)} style={{border:"none", transform:"translateY(4px) translateX(-8px)"}}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    <div className="bg-dark-medium  px-2 border-1 mt-2 rounded flex-grow-1 d-flex" style={{fontSize:"10pt", paddingTop:"7px"}}>
                      <p className="flex-grow-1 text-break" style={{marginBottom:"8px"}}>{step.content}</p>
                    </div>
                    <Status currentStep={step} currentTask={step} setTask={setTask} setProject={setProject}/>
                </li>
                }
                </React.Fragment>
            ))}
        </ul>
      </li>
    )
}

export default Steps;