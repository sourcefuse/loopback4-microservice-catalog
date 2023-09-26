// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {extensionFor, injectable} from '@loopback/core';
import {CONTENT_TYPE} from '../../constants';
import {ServiceBuilderExtensionPoint} from './keys';
import {RestOperationTemplate} from './types';

export function restProxyBuilder(basePath: string): RestOperationTemplate[] {
  return [
    {
      template: {
        method: 'POST',
        url: basePath,
        headers: {
          'content-type': CONTENT_TYPE.JSON,
          Authorization: '{token}',
        },
        body: '{body}',
      },
      functions: {
        create: ['token', 'body'],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${basePath}/{id}`,
        headers: {
          'content-type': CONTENT_TYPE.JSON,
          Authorization: '{token}',
        },
        query: {
          filter: '{filter}',
        },
      },
      functions: {
        findById: ['token', 'id', 'filter'],
      },
    },
    {
      template: {
        method: 'GET',
        url: basePath,
        headers: {
          'content-type': CONTENT_TYPE.JSON,
          Authorization: '{token}',
        },
        query: {
          filter: '{filter}',
        },
      },
      functions: {
        find: ['token', 'filter'],
      },
    },
    {
      template: {
        method: 'PATCH',
        url: `${basePath}/{id}`,
        headers: {
          'content-type': CONTENT_TYPE.JSON,
          Authorization: '{token}',
        },
        body: '{body}',
      },
      functions: {
        updateById: ['token', 'id', 'body'],
      },
    },
    {
      template: {
        method: 'DELETE',
        url: `${basePath}/{id}`,
        headers: {
          'content-type': CONTENT_TYPE.JSON,
          Authorization: '{token}',
        },
      },
      functions: {
        deleteById: ['token', 'id'],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${basePath}/count`,
        headers: {
          'content-type': CONTENT_TYPE.JSON,
          Authorization: '{token}',
        },
        query: {
          where: '{where}',
        },
      },
      functions: {
        count: ['token', 'where'],
      },
    },
    {
      template: {
        method: 'PUT',
        url: `${basePath}/{id}`,
        headers: {
          'content-type': CONTENT_TYPE.JSON,
          Authorization: '{token}',
        },
        body: '{body}',
      },
      functions: {
        replaceById: ['token', 'id', 'body'],
      },
    },
    {
      template: {
        method: 'PATCH',
        url: basePath,
        headers: {
          'content-type': CONTENT_TYPE.JSON,
          Authorization: '{token}',
        },
        body: '{body}',
        query: {
          where: '{where}',
        },
      },
      functions: {
        update: ['token', 'body', 'where'],
      },
    },
    {
      template: {
        method: 'DELETE',
        url: basePath,
        headers: {
          Authorization: '{token}',
        },
        query: {
          where: '{where}',
        },
      },
      functions: {
        delete: ['token', 'where'],
      },
    },
  ];
}

export const asRestResolver = () =>
  injectable(binding => {
    extensionFor(ServiceBuilderExtensionPoint.key)(binding);
    binding.tag({namespace: ServiceBuilderExtensionPoint.key});
  });
