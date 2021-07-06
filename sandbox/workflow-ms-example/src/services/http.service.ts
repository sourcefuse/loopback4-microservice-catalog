import {BindingScope, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {STATUS_CODE} from '@sourceloop/core';
import FormData from 'form-data';
import fetch, {Response} from 'node-fetch';
import {HttpOptions} from './types';

@injectable({scope: BindingScope.TRANSIENT})
export class HttpClientService {
  get(url: string, options?: HttpOptions) {
    const processed = this.processOptions(url, options);
    return fetch(processed.url, {
      headers: processed.headers,
    }).then(res => this.handleRes(res));
  }

  delete(url: string, options?: HttpOptions) {
    const processed = this.processOptions(url, options);
    return fetch(processed.url, {
      method: 'delete',
      headers: processed.headers,
    }).then(res => this.handleRes(res));
  }

  post(url: string, body: AnyObject, options?: HttpOptions) {
    const processed = this.processOptions(url, options);
    return fetch(processed.url, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
        ...processed.headers,
      },
    }).then(res => this.handleRes(res));
  }

  postFormData(url: string, body: FormData, options?: HttpOptions) {
    const processed = this.processOptions(url, options);
    return fetch(processed.url, {
      method: 'post',
      body: body,
      headers: {
        ...body.getHeaders(),
        ...processed.headers,
      },
    }).then(res => this.handleRes(res));
  }

  private processOptions(url: string, options?: HttpOptions) {
    let headers = {};
    if (options?.query) {
      url = `${url}?${this.serialize(options.query)}`;
    }
    if (options?.urlParams) {
      for (const key in options.urlParams) {
        url = url.replace(
          new RegExp(`\\{${key}\\}`, 'gi'),
          options.urlParams[key],
        );
      }
    }
    if (options?.headers) {
      headers = options.headers;
    }

    return {url, headers};
  }

  private async handleRes(res: Response) {
    if (res.status === STATUS_CODE.OK) {
      return res.json().catch(e => ({}));
    } else if (res.status === STATUS_CODE.NO_CONTENT) {
      return {};
    } else {
      throw new HttpErrors.BadRequest(await res.text());
    }
  }

  private serialize(obj: AnyObject) {
    const str = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
      }
    }
    return str.join('&');
  }
}
