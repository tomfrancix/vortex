import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import UseEnhancedLogger from '../../debug/EnhancedLogger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';

const Description = ( {currentTask, setTask, setProject} ) => {
  const { debug, info, warn, error } = UseEnhancedLogger('Task');

  const [editDescriptionFormIsVisible, displayEditDescriptionForm] = useState(false);

  const descriptionInputRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click is outside the form and if the form is visible
      if (editDescriptionFormIsVisible && !event.target.closest('.form-description-container')) {
        displayEditDescriptionForm(false);
        formikDescription.resetForm();
      }
    };

    // Attach event listener
    document.addEventListener('click', handleOutsideClick);

    // Detach event listener on component unmount
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [editDescriptionFormIsVisible]);

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
        displayEditDescriptionForm(false);

        setProject((prevProject) => {

          var index = prevProject.tasks.findIndex((task) => task.taskItemId === data.taskItemId)

          prevProject.tasks[index] = data;

          info("Setting project...");
          info(prevProject);
          return prevProject;
        });
  
        formikDescription.resetForm();
  
      } else {
        error(`Failed to ${url.split('/').pop()}:${response.statusText}`);
      }

    } catch (ex) {
        error(`Error ${url.split('/').pop()}:${ex}`);
    }
  };

  const formikDescription = useFormik({
    initialValues: {
      taskItemId: currentTask.taskItemId
    },
    onSubmit: values => {
        info(values);
        editTask(values);
    },
  });
  
  function submitOnEnter(event) {
    if (event.which === 13 && !event.shiftKey) {
      console.log(event)
        if (!event.repeat) {
            const newEvent = new Event("submit", {cancelable: true});
            event.target.form.requestSubmit();
        }

        event.preventDefault();
    }
  }
  
  useEffect(() => {
    if (editDescriptionFormIsVisible) {
      formikDescription.setFieldValue("value", currentTask.description);
      document.getElementById("descriptionValue").removeEventListener("keydown", submitOnEnter);
      document.getElementById("descriptionValue").addEventListener("keydown", submitOnEnter);
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
  
  const displayDescriptionForm = (shouldDisplay, currentValue, ref) => {
    if (ref.current) {
      ref.current.focus();
      formikDescription.setFieldValue("value", currentValue);
    }
    displayEditDescriptionForm(shouldDisplay);
  };

  return (
      <li className="list-group-item bg-dark-medium text-light border border-secondary">
        <small>Description:</small><br/>
        {
          editDescriptionFormIsVisible ? (
            <form onSubmit={formikDescription.handleSubmit} className="form-description-container mb-4">
                <div className="input-group mb-0 fs-6 text-light mt-2">

                  <input type="hidden" name="field" id="field" value="description" />
                  <textarea
                  ref={descriptionInputRef} 
                  type="text"
                  id="descriptionValue"
                  name="value"
                  onChange={formikDescription.handleChange}
                  value={formikDescription.values.value}
                  className="form-control form-control-sm bg-dark text-light border-0 mb-1"
                  style={{height: `${(currentTask.description.match(/\n/g) || []).length * 1.5 + 3}em`}}
                  ></textarea>
                </div>
                  <button type="submit" className="btn btn-sm btn-success m-0 mt-0" style={{height:"25px", padding:"0 5px", float:"right" }}>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
            </form>
          ) : (
            <>
            {
              currentTask.description.length < 1 ? (
                <div
                  type="submit"
                  onClick={() => displayDescriptionForm(true, currentTask.description, descriptionInputRef)}
                  className="btn btn-sm btn-default text-light w-100 p-2 mt-1"
                  style={{ border:"1px dashed grey", textAlign:"left", whiteSpace: "pre-line"}}
                >
                  <span style={{textDecoration:"underline", textDecorationStyle:"dotted"}}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span className="px-2">Add a description</span>
                  </span>
                </div>
              ) : (
                <div
                  type="submit"
                  onClick={() => displayDescriptionForm(true, currentTask.description, descriptionInputRef)}
                  className="btn btn-sm btn-default text-light w-100"
                  style={{ padding:"14px 6px", textAlign:"left", whiteSpace: "pre-line", height: `${(currentTask.description.match(/\n/g) || []).length * 1.5 + 5}em` }}
                >
                <p>{currentTask.description == "" ? "" : currentTask.description}</p>
                </div>
              )
            }
            </>
          )
        }
      </li>
  );
};

export default Description;