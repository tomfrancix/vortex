import React, { useState, useEffect, useRef } from 'react';
import UseEnhancedLogger from '../../../debug/EnhancedLogger';

const Status = ( {currentStep, currentTask, setTask, setProject} ) => {
  const { debug, info, warn, error } = UseEnhancedLogger('Step');
  const [step, setStep] = useState(currentStep);

  const editStep = async (formData) => {
    var url = '/api/step/edit';
    
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
        setStep(data);
        setTask((prevTask) => {

          var index = prevTask.steps.findIndex((step) => step.stepId === data.stepId)

          prevTask.steps[index] = data;

          info("Setting task...");
          info(prevTask);
          return prevTask;
        });
  
      } else {
        error(`Failed to ${url.split('/').pop()}:${response.statusText}`);
      }

    } catch (ex) {
        error(`Error ${url.split('/').pop()}:${ex}`);
    }
  };

  const handleStepStatusChange = async (isCompleted) => {
    console.log(`New status = ${isCompleted}`);
    editStep({
      status: isCompleted,
      stepId:step.stepId
    });
  }

  return (
    <form className="p-2 pt-3">
      <label className="checkbox-container">
        <input
          type="checkbox"
          name="status"
          value={step.status}
          checked={step.status}
          onChange={() => handleStepStatusChange(!step.status)}
          role="button"
        />
        <span className="checkmark"></span>
      </label>
    </form>
  );
};

export default Status;