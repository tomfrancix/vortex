const TaskStatusEnum = {
    REQUESTED: 'Requested',
    IN_PROGRESS: 'In Progress',
    FOR_REVIEW: 'For Review',
    COMPLETED: 'Completed',
    ARCHIVED: 'Archived'
  };

export const TaskStatusValues = Object.values(TaskStatusEnum);

export default TaskStatusEnum;