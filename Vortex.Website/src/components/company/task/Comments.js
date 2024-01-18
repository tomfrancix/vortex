import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import UseEnhancedLogger from '../../debug/EnhancedLogger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faTrash } from '@fortawesome/free-solid-svg-icons';

const Comments = ({currentTask, setTask}) => {
    const { debug, info, warn, error } = UseEnhancedLogger('Comments');
    const [addCommentFormIsVisible, displayAddCommentForm] = useState(false);
    const commentsInputRef = useRef(null);
    const token = localStorage.getItem('accessToken');

    const splitString = (input, maxLength) => {
      const lines = input.split('\n');
      const result = lines.reduce((acc, line) => {
        const chunks = [];
        for (let i = 0; i < line.length; i += maxLength) {
          chunks.push(line.substring(i, i + maxLength));
        }
        return acc.concat(chunks);
      }, []);
    
      return result;
    };

    const getHeight = (element) => {
      if (element != null) {
        const width = element.current.clientWidth;
        const characterWidth = 10;
        const lines = splitString(element.current.value, width/characterWidth).length + 1;
        const lineHeight = 1.5; 
        return `${lines * lineHeight + 5}em`;
      }
    }

    useEffect(() => {
      const handleOutsideClick = (event) => {
        // Check if the click is outside the form and if the form is visible
        if (addCommentFormIsVisible && !event.target.closest('.form-comments-container')) {
          displayAddCommentForm(false);
          formikComments.resetForm();
        }
      };

      const updateTextAreaHeight = () => {
        if (addCommentFormIsVisible && commentsInputRef.current) {
          const newHeight = getHeight(commentsInputRef);

          commentsInputRef.current.style.height = newHeight;
        }
      };
  
      commentsInputRef.current?.addEventListener('input', updateTextAreaHeight);
  
      // Attach event listener
      document.addEventListener('click', handleOutsideClick);
  
      // Detach event listener on component unmount
      return () => {
        commentsInputRef.current?.removeEventListener('input', updateTextAreaHeight);
        document.removeEventListener('click', handleOutsideClick);
      };

    }, [addCommentFormIsVisible]);

    const addComment = async (formData) => {
        info("ADDING COMMENT");
        info(currentTask);
        info(formData);
        var url = '/api/comment/new';

        if (formData.text.length > 0) {

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
        }
    };

    const formikComments = useFormik({
      enableReinitialize: true, 
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
      if (addCommentFormIsVisible) {
        formikComments.setFieldValue("taskItemId", currentTask.taskItemId);
        
        document.getElementById("addComment").removeEventListener("keydown", submitOnEnter);
        document.getElementById("addComment").addEventListener("keydown", submitOnEnter);
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

    const deleteComment = async (id) => {

      var url = '/api/Comment/delete'
  
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
          const updatedComments = prevTask.comments.filter(
          (comment) => comment.commentId !== id
          );
  
          const updatedTask = { ...prevTask, comments: updatedComments };
  
          return updatedTask;
        });
      } else {
        console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
      }
    };
    
    return (
        <li className="list-group-item bg-dark text-light border border-secondary">
            <small>Comments:</small><br/>
            <ul className="comments p-0 m-0">
                        {currentTask.comments?.map((comment, index) => (
                <React.Fragment key={comment.commentId}>
                {
                <>
                  <li className="d-flex">
                      <div className="bg-dark-medium py-1 px-2 border-1 mt-2 flex-grow-1" style={{fontSize:"10pt", padding:"14px 6px", textAlign:"left", whiteSpace: "pre-line", 
                      height: getHeight(this)}}>
                        <strong className="text-muted">
                          <small>
                    <FontAwesomeIcon icon={faUser} />
                            <span className="px-2">
                            {comment.user.firstName} {comment.user.lastName}
                            </span>
                          </small>
                          </strong>
                          <button className="btn btn-sm btn-default deleteButton px-0 pt-0" onClick={() => deleteComment(comment.commentId)} style={{border:"none", float:"right"}}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                            <hr className="m-1"/>
                        <p className="m-0 p-1 text-break">
                          <strong>{comment.content}</strong>
                        </p>
                      </div>
                  </li>
                </>
                }
                </React.Fragment>
            ))}
        </ul>

        {
          addCommentFormIsVisible ? (
            <form onSubmit={formikComments.handleSubmit} className="form-comments-container">
              <i className="glyphicon glyphicon-unchecked" ></i>
              <div className="input-group mb-2 fs-6  text-light mt-2">
                <input type="hidden" name="taskItemId" value={currentTask.taskItemId} />
                <textarea
                ref={commentsInputRef} 
                type="text"
                id="addComment"
                name="text"
                onChange={formikComments.handleChange}
                value={formikComments.values.text}
                className="form-control form-control-sm bg-dark text-light border-0"
                >Enter text...</textarea>
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
      </li>
    )
}

export default Comments;