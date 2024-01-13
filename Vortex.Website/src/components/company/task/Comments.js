import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import UseEnhancedLogger from '../../debug/EnhancedLogger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';

const Comments = ({currentTask, setTask}) => {
    const { debug, info, warn, error } = UseEnhancedLogger('Comments');
    const [addCommentFormIsVisible, displayAddCommentForm] = useState(false);
    const commentsInputRef = useRef(null);

    useEffect(() => {
      const handleOutsideClick = (event) => {
        // Check if the click is outside the form and if the form is visible
        if (addCommentFormIsVisible && !event.target.closest('.form-comments-container')) {
          displayAddCommentForm(false);
          formikComments.resetForm();
        }
      };
  
      // Attach event listener
      document.addEventListener('click', handleOutsideClick);
  
      // Detach event listener on component unmount
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }, [addCommentFormIsVisible]);

    const addComment = async (formData) => {
        info("ADDING COMMENT");
        info(currentTask);
        info(formData);
        var url = '/api/comment/new';
        
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
            if (currentTask.comments == null) {
              currentTask.comments = [];
            }
            info(currentTask);
            const updatedComments = [...currentTask.comments, data];
            info(updatedComments);
            setTask(currentTask => {
              currentTask.comments = updatedComments;
              info(currentTask);
              return currentTask;
            })
            displayAddCommentForm(false);
    
            formikComments.resetForm();
      
          } else {
            error(`Failed to ${url.split('/').pop()}:${response.statusText}`);
          }
    
        } catch (ex) {
            error(`Error ${url.split('/').pop()}:${ex}`);
        }
    };

    const formikComments = useFormik({
        initialValues: {
          taskItemId: currentTask.taskItemId,
          text: ''
        },
        onSubmit: values => {
          info("VALUES")
          info(values);
          info(currentTask);
          addComment(values);
        },
    });

    useEffect(() => {
      if (addCommentFormIsVisible) {
        formikComments.setFieldValue("taskItemId", currentTask.taskItemId);
        commentsInputRef.current.focus();
      }
    }, [addCommentFormIsVisible, currentTask.comments]);
    
    const displayCommentForm = (shouldDisplay, currentValue, ref) => {
        info("currentTask");
        info(currentTask);
        if (ref.current) {
            ref.current.focus();
        }
        displayAddCommentForm(shouldDisplay);
    };
    
    return (
        <li className="list-group-item bg-dark text-light border border-secondary">
            <small>Comments:</small><br/>
            <ul className="comments p-0 m-0">
            {
            addCommentFormIsVisible ? (
                <form onSubmit={formikComments.handleSubmit} className="form-comments-container">
                  <i className="glyphicon glyphicon-unchecked" ></i>
                  <div className="input-group mb-2 fs-6  text-light mt-2">
                    <input type="hidden" name="taskItemId" value={currentTask.taskItemId} />
                    <input
                    ref={commentsInputRef} 
                    type="text"
                    id="text"
                    name="text"
                    onChange={formikComments.handleChange}
                    value={formikComments.values.text}
                    className="form-control form-control-sm bg-dark text-light border-0"
                    placeholder={`Enter text...`}
                    />
                  </div>
                    <button type="submit" style={{display:"none"}}></button>
                </form>
            ) : (
                <button type="submit"  
                onClick={() => displayCommentForm(true, currentTask.comments, commentsInputRef)} 
                className="card bg-dark text-light border-secondary p-2 mt-2 w-100 mb-2"
                style={{border:"1px dashed grey", flexDirection:"row"}} >
                <div>
                    <FontAwesomeIcon icon={faPlus} />
                </div>
                <span className="px-2">Add Comment</span>
                </button>
            )
            }

            {currentTask.comments?.slice().reverse().map((comment, index) => (
                <React.Fragment key={comment.commentId}>
                {
                <>
                  <li className="d-flex">
                      <div className="bg-dark-medium py-1 px-2 border-1 mt-2 flex-grow-1" style={{fontSize:"10pt"}}>
                        <strong>{comment.user.firstName} {comment.user.lastName}</strong>
                        <p style={{marginBottom:"8px"}}>{comment.content}</p>
                      </div>
                  </li>
                </>
                }
                </React.Fragment>
            ))}
        </ul>
      </li>
    )
}

export default Comments;