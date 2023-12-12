export interface ISubTaskService {
  complete(taskId: string, subtaskId: string): Promise<void>;
  // update pending subtasks list for a task
  updateList(taskId: string, processInstanceId: string): Promise<void>;
}
