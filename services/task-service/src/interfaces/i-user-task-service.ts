export interface IUserTaskService {
  complete(taskId: string, userTaskId: string): Promise<void>;
  // update pending usertasks list for a task
  updateList(taskId: string, processInstanceId: string): Promise<void>;
}
