export const samplePayload = {
  key: 'create_tasks',
  description: 'running sample case',
  source: 'postman demo',
  payload: {
    users: [],
    fetch_from_groups: ['dev_group'],
    fetch_from_roles: [],
    tasks: [
      {key: 'form_fill_task', name: 'fill a form A', assignee: 'dev_user1'},
      {
        key: 'review_task',
        name: 'handle a form and fill B',
        assignee: 'dev_user2',
      },
    ],
  },
};
