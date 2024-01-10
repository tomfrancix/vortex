import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Tasks = ( {project, setTask, setProject, currentTask} ) => {
  
  const [newTaskFormIsVisible, displayNewTaskForm] = useState(false);
  const inputRef = useRef(null); 

  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Getting tasks for project...");
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
          console.log(data);
  
          setProject((prevProject) => {
            // Use the previous state to ensure you're updating based on the current state
            const updatedProject = { ...prevProject, tasks: data };
            console.log("Setting project...");
            console.log(updatedProject);
            return updatedProject;
          });
        } else {
          console.error('Failed to fetch tasks:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    fetchTasks();
  
    if (newTaskFormIsVisible) {
      inputRef.current.focus();
    }
  
  }, [newTaskFormIsVisible, currentTask, project.projectId]);

  const createTask = async (formData) => {
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

          console.log("updatedProject");
          console.log(updatedProject);
          return updatedProject;
        });

        formik.resetForm();

      } else {
        console.error(`Failed to ${url.split('/').pop()}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error ${url.split('/').pop()}:`, error);
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

  console.log("project.tasks");
  console.log(project.tasks);
  return (
    <div>

      {/** The form for creating a new task. */}
      {
        newTaskFormIsVisible ? (
          <form onSubmit={formik.handleSubmit}>
              <div className="input-group mb-2 fs-6 text-light">
                <input
                ref={inputRef} 
                type="text"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                className="form-control form-control-sm bg-dark text-light"
                placeholder={`Name the task...`}
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
          >
            <div className="inline-block">
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div className="inline-block">Add Task</div>
          </button>
          </>
        )
      }

      <hr />

      {/** The list of existing tasks. This is where they should render after setProject()*/}
      <div className="tab-content">
        <div className="tab-pane active" id="requested">
        {project?.tasks?.slice().reverse().map((task, index) => (
          <>
          {
            task?.taskItemId == currentTask?.taskItemId ? (
              <div key={task.taskItemId}  type="submit" className="card bg-success text-light p-2 px-3 w-100 mb-2" >
                {task.taskItemId} {task.summary}
              </div>
            ) : (
              <button key={task.taskItemId}  type="submit" className="card bg-dark text-light p-2 px-3 w-100 mb-2"  onClick={() => setTask(task)}>
                {task.taskItemId} {task.summary}
              </button>
            )
          }
          </>
          ))
        }
        </div>
        <div className="tab-pane container fade" id="inProgress">...</div>
        <div className="tab-pane container fade" id="forReview">...</div>
        <div className="tab-pane container fade" id="completed">...</div>
        <div className="tab-pane container fade" id="archived">...</div>
      </div>
      
    </div>
  );
};

export default Tasks;