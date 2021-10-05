import {PathsObject} from 'openapi3-ts/dist/model/OpenApi';
import {OasHiddenApi} from '../services/enhancer-keys';

function apiSearchFunction(
  apiSearch: [string, OasHiddenApi],
  path: PathsObject,
) {
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
export function apiHide(
  arrayApiSearch: [string, OasHiddenApi][],
  paths: PathsObject,
) {
  arrayApiSearch.forEach(apiSearch => {
    for (const path in paths) {
      if (path === apiSearch[1]['path']) {
        apiSearchFunction(apiSearch, paths[path]);
      }
    }
  });
}
