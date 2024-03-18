import {Task} from '../../models';
import {TaskPriority, TaskSeverity, TaskStatus} from '../../types';

export const mockEvent = {
  key: 'event',
  payload: {
    name: 'test',
    description: 'description',
  },
  source: 'test-source',
  description: 'description',
};
export const mockUnexpectedEvent = {
  key: 'unexpected-event',
  payload: {
    name: 'test2',
    description: 'description2',
  },
  source: 'test-source-2',
  description: 'description2',
};
export const mockUnmappedEvent = {
  key: 'unmapped-event',
  payload: {
    name: 'test3',
    description: 'description3',
  },
  source: 'test-source-3',
  description: 'description3',
};
export const mockTasks: Task[] = [
  new Task({
    name: 'task-name',
    key: 'test-task',
    status: TaskStatus.Pending,
    priority: TaskPriority.High,
    severity: TaskSeverity.High,
    type: 'task-1',
    metadata: {},
    externalId: 'processInstanceId1',
  }),
];
