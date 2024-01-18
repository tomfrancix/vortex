import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import UseEnhancedLogger from '../../debug/EnhancedLogger';

const Summary = ( {currentTask, setTask, setProject} ) => {
  const { debug, info, warn, error } = UseEnhancedLogger('Summary');

  const [editSummaryFormIsVisible, displayEditSummaryForm] = useState(false);

  const summaryInputRef = useRef(null); 

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click is outside the form and if the form is visible
      if (editSummaryFormIsVisible && !event.target.closest('.form-summary-container')) {
        displayEditSummaryForm(false);
        formikSummary.resetForm();
      }
    };

    // Attach event listener
    document.addEventListener('click', handleOutsideClick);

    // Detach event listener on component unmount
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [editSummaryFormIsVisible]);

  const editTask = async (formData) => {
    var url = '/api/taskitem/edit';
    if (formData.field == null) {
      formData.field = document.querySelector('input[name="field"]')?.value 
    }

    if (formData.field == "summary" && formData.value.length < 1) {
      return;
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
        displayEditSummaryForm(false);

        setProject((prevProject) => {

          var index = prevProject.tasks.findIndex((task) => task.taskItemId === data.taskItemId)

          prevProject.tasks[index] = data;

          info("Setting project...");
          info(prevProject);
          return prevProject;
        });
  
        formikSummary.resetForm();
  
      } else {
        error(`Failed to ${url.split('/').pop()}:${response.statusText}`);
      }

    } catch (ex) {
        error(`Error ${url.split('/').pop()}:${ex}`);
    }
  };

  const formikSummary = useFormik({
    enableReinitialize: true, 
    initialValues: {
      taskItemId: currentTask.taskItemId
    },
    onSubmit: values => {
        info(values);
        
        editTask(values);
    },
  });

  useEffect(() => {
    if (editSummaryFormIsVisible) {
      formikSummary.setFieldValue("value", currentTask.summary);
      summaryInputRef.current.focus();
    }
  }, [editSummaryFormIsVisible, currentTask.summary]);

  useEffect(() => {
    if (summaryInputRef.current) {
      summaryInputRef.current.focus();
    }
  }, [summaryInputRef]);

  const displaySummaryForm = (shouldDisplay, currentValue, ref) => {
    if (ref.current) {
      ref.current.focus();
      formikSummary.setFieldValue("value", currentValue);
    }
    displayEditSummaryForm(shouldDisplay);
  };

  return (
      <li className="list-group-item bg-dark-medium text-light border border-secondary">
        <small>Summary:</small><br/>
        {
          editSummaryFormIsVisible ? (
            <form onSubmit={formikSummary.handleSubmit} class="form-summary-container">
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
              className="btn btn-sm btn-default text-light "
              style={{ padding:"14px 6px", fontWeight:"bold", textDecoration:"underline", textDecorationStyle:"dotted", textAlign:"left"}}
            >
              {currentTask.summary} {currentTask.taskitemId}
            </button>
            </>
          )
        }
      </li>
  );
};

export default Summary;