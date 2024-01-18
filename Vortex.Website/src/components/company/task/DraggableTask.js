import { useDrag, useDrop } from 'react-dnd';
import popSound from '../../../assets/sounds/pop.mp3';

const playSound = () => {
  const audio = new Audio(popSound);
  audio.volume = 0.3;
  audio.play();
};

const DraggableTask = ({ task, moveTask, currentTask, setTask, allTasks }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'TASK',
    item: { taskItemId: task.taskItemId, rank: task.rank },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        // The item was dropped successfully
        playSound();
      }
    },
  });

  const resetTaskStyles = () => {
    for (var taskItem of document.querySelectorAll(`.task-card`)) {
        taskItem?.classList.add("bg-dark");
        taskItem?.classList.remove("bg-light");
        taskItem?.classList.remove("text-dark");
        taskItem?.classList.add("text-light");

        if (taskItem.hasAttribute('currentTask')) {
          taskItem?.classList.add("bg-dark-medium");
        }
    }
  }

  const [, drop] = useDrop({
    accept: 'TASK',
    hover: (draggedItem) => {
      var toRank = task.rank;
      console.log("Hovering over " + toRank);
      resetTaskStyles();
      document.querySelector(`#rank${toRank}`)?.classList.remove("bg-dark-medium");
      document.querySelector(`#rank${toRank}`)?.classList.remove("bg-dark");
      document.querySelector(`#rank${toRank}`)?.classList.add("bg-light");
      document.querySelector(`#rank${toRank}`)?.classList.add("text-dark");
    },
    drop: (draggedItem) => {
      var taskCount = allTasks.length;
      var toRank = task.rank;
      if (draggedItem.rank !== toRank) {
        console.log(`task count: ${taskCount}, moving to rank: ${toRank}`);
        moveTask(draggedItem.rank, toRank, draggedItem.taskItemId);
        resetTaskStyles();
      }
    },
  });

  return (
    <>
      {task?.taskItemId === currentTask?.taskItemId ? (
        <div ref={(node) => preview(drop(drag(node)))} id={`rank${task.rank}`} currentTask={true} className={`card task-card text-light bg-dark-medium p-2 px-3 w-100 mt-2 ${isDragging ? 'dragging' : ''}`} style={{ textAlign: "left" }}>
          {task.summary}
        </div>
      ) : (
        <button ref={(node) => preview(drop(drag(node)))} id={`rank${task.rank}`} className={`card task-card bg-dark text-light p-2 px-3 w-100 mt-2 ${isDragging ? 'dragging' : ''}`} style={{ textAlign: "left" }} onClick={() => setTask(task)}>
          {task.summary}
        </button>
      )}
    </>
  );
};

export default DraggableTask;