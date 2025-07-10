import { createTask } from '../lib/user-actions';
import AddTaskClient from './add-task-client';

export default function AddTaskForm() {
  return <AddTaskClient createTaskAction={createTask} />;
}
