/* eslint-disable @typescript-eslint/no-explicit-any */
function apiSearchFunction(apiSearch: any, path: any) {
  if (path['get'] && apiSearch[1]['httpMethod'] === 'GET') {
    delete path['get'];
  }
  if (path['post'] && apiSearch[1]['httpMethod'] === 'POST') {
    delete path['post'];
  }
  if (path['patch'] && apiSearch[1]['httpMethod'] === 'PATCH') {
    delete path['patch'];
  }
  if (path['delete'] && apiSearch[1]['httpMethod'] === 'DELETE') {
    delete path['delete'];
  }
  if (path['put'] && apiSearch[1]['httpMethod'] === 'PUT') {
    delete path['put'];
  }
}
export function apiHide(arrayApiSearch: Array<any>, paths: any) {
  arrayApiSearch.forEach(apiSearch => {
    for (const path in paths) {
      if (path === apiSearch[1]['path']) {
        apiSearchFunction(apiSearch, paths[path]);
      }
    }
  });
}
