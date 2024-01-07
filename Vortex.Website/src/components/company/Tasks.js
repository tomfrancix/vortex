import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';

const Tasks = ( {project, setTask, setProject, currentTask} ) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskFormIsVisible, displayNewTaskForm] = useState(false);
  const inputRef = useRef(null); 
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/TaskItem/list', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(project.projectId)
        });

        // Replace with the actual API endpoint
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Failed to fetch tasks:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks(); // Call fetchTasks when the component mounts

    if (newTaskFormIsVisible) {
      inputRef.current.focus();
    }

  }, [newTaskFormIsVisible]); // The empty dependency array ensures this effect runs only once on mount

  const newTask = async (url, id) => {
    try {
        const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(id)
        });

        return response;

    } catch (error) {
        console.error(`Error ${url.split('/').pop()}:`, error);
    }
};

const createTask = async (formData) => {
  var url = '/api/taskitem/new';

  try {
    const response = await newTask(url, formData);

    if (response.ok) {
      const data = await response.json();
      setTask(data);
      displayNewTaskForm(false);

      setProject((prevProject) => {
      
        const updatedTasks = [...prevProject.tasks.$values, data];

        const updatedProject = { ...prevProject, tasks: { $values: updatedTasks } };

        setTasks(updatedTasks);

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

  console.log("task");
  console.log(tasks);
  console.log(currentTask);

  return (
    <div>
      {
        newTaskFormIsVisible ? (
          <form onSubmit={formik.handleSubmit}>
              <div className="input-group mb-2 fs-6 font-monospace text-light">
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
          <button type="submit"  onClick={() => displayNewTaskForm(true)} className="card bg-dark text-light p-2 px-3 w-100 mb-2 font-monospace" >
            Add Task
          </button>
          </>
        )
      }
      {tasks.slice().reverse().map((task, index) => (
        <>
        {
          task?.taskItemId == currentTask?.taskItemId ? (
            <div type="submit" className="card bg-success text-light p-2 px-3 w-100 mb-2 font-monospace" >
              {task.summary}
            </div>
          ) : (
            <button type="submit" className="card bg-dark text-light p-2 px-3 w-100 mb-2 font-monospace"  onClick={() => setTask(task)}>
              {task.summary}
            </button>
          )
        }</>
      ))}
    </div>
  );
};

export default Tasks;