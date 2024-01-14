import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import UseEnhancedLogger from '../debug/EnhancedLogger';
import TaskStatusEnum, { TaskStatusValues } from '../enum/TaskStatusEnum';
import ScrollableElement from './ScrollableElement';

const Tasks = ({ project, setTask, setProject, currentTask, currentCollaborator }) => {
  const { debug, info, warn, error } = UseEnhancedLogger('Tasks');

  const [newTaskFormIsVisible, displayNewTaskForm] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    console.log("Tasks: Set Collaborator", currentCollaborator);
}, [currentCollaborator]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click is outside the form and if the form is visible
      if (newTaskFormIsVisible && !event.target.closest('.form-task-container')) {
        displayNewTaskForm(false);
        formik.resetForm();
      }
    };

    // Attach event listener
    document.addEventListener('click', handleOutsideClick);

    // Detach event listener on component unmount
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [newTaskFormIsVisible]);

  useEffect(() => {
    const fetchTasks = async () => {
      info("function: fetchTasks");
      try {
        const response = await fetch('/api/TaskItem/list', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify(project.projectId)
        });

        if (response.ok) {
          const data = await response.json();
          info(data);

          setProject((prevProject) => {
            var tasks = [];
            if (data != undefined && data.length > 0) {
              data.forEach((task) => {
                console.log(task);
                tasks.push(task);
              })
            }
            // Use the previous state to ensure you're updating based on the current state
            const updatedProject = { ...prevProject, tasks: tasks };
            info("Setting project...");
            info(updatedProject);
            return updatedProject;
          });
        } else {
          error('Failed to fetch tasks:', response.statusText);
        }
      } catch (error) {
        error('Error fetching tasks:', error);
      }
    };

    fetchTasks();

    if (newTaskFormIsVisible) {
      inputRef.current.focus();
    }

  }, [newTaskFormIsVisible, currentTask, project.projectId]);

  const createTask = async (formData) => {
    info("function: createTask");
    var url = '/api/taskitem/new';

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
        const task = await response.json();
        setTask(task);
        displayNewTaskForm(false);

        setProject((prevProject) => {

          const updatedTasks = [...prevProject.tasks, task];

          const updatedProject = { ...prevProject, tasks: updatedTasks };

          info("updatedProject");
          info(updatedProject);
          return updatedProject;
        });

        displayNewTaskForm(true);

        formik.resetForm();

      } else {
        error(`Failed to ${url.split('/').pop()}:`, response.statusText);
      }
    } catch (error) {
      error(`Error ${url.split('/').pop()}:`, error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: ''
    },
    onSubmit: values => {
      values.projectId = project.projectId;
      createTask(values);
    },
  });

  return (
    <div>
      <div className="p-1">

        {/** The form for creating a new task. */}
        {
          newTaskFormIsVisible ? (
            <form onSubmit={formik.handleSubmit} className="form-task-container">
              <div className="input-group mb-2 fs-6 text-light">
                <input
                  ref={inputRef}
                  type="text"
                  id="name"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  className="form-control form-control-sm bg-dark text-light"
                  placeholder={`Summarise the task...`}
                />
                <button type="submit" className="btn btn-success">Go</button>
              </div>
            </form>
          ) : (
            <>
              <button
                type="submit"
                onClick={() => displayNewTaskForm(true)}
                className="card bg-dark text-light p-2 px-3 w-100 mb-2 d-flex"
                style={{ flexDirection: "row", border: "1px dashed grey" }}
              >
                <div>
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <div className="px-2">Add Task</div>
              </button>
            </>
          )
        }
      </div>

      <hr className="p-0 m-0" />

      {/** The list of existing tasks. This is where they should render after setProject()*/}
        <ScrollableElement>
          <div className="tab-content" style={{ padding: "0 0 5px 5px" }}>
            {TaskStatusValues.map((status, index) => (
              <React.Fragment key={status}>
                <div className="tab-pane" id={`${status.replace(" ", "")}`}>
                  {project
                    ?.tasks
                    ?.filter(task => task.status === index && (currentCollaborator != null ? (task.creator === currentCollaborator.userName || task.owner === currentCollaborator.userName) : task))
                    .slice()
                    .reverse()
                    .map((task, taskIndex) => (
                      <React.Fragment key={task.taskItemId}>
                        {
                          task?.taskItemId === currentTask?.taskItemId ? (
                            <div type="submit" className="card text-light bg-dark-medium p-2 px-3 w-100 mt-2" style={{ textAlign: "left" }} >
                              {task.summary}
                            </div>
                          ) : (
                            <button type="submit" className="card bg-dark text-light p-2 px-3 w-100 mt-2" style={{ textAlign: "left" }} onClick={() => setTask(task)}>
                              {task.summary}
                            </button>
                          )
                        }
                      </React.Fragment>
                    ))
                  }
                </div>
              </React.Fragment>
            ))}
          </div>
        </ScrollableElement>
    </div>
  );
};

export default Tasks;