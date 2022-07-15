// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {HEROES} from './mock-heroes';
import {Hero} from './hero';

@Injectable()
export class FakeBackendHttpInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const {url, method} = request;
    if (url.endsWith('/heroes')) {
      return this.handleEndsWithHeroes(request, method);
    }
    if (url.match(/\/heroes\/.*/) && method === 'DELETE') {
      return of(new HttpResponse({status: 204}));
    }
    if (url.includes('heroes/?name=') && method === 'GET') {
      const name = url.split('=')[1];
      const res = HEROES.filter(hero => hero.name.match(name));
      return of(new HttpResponse({body: res, status: 200}));
    }
    if (url.match(/\/heroes\/.*/) && method === 'GET') {
      const n = url.lastIndexOf('/');
      const id = +url.substring(n + 1);
      const body = HEROES.filter(hero => hero.id === id)[0];
      if (body) {
        return of(new HttpResponse({status: 200, body}));
      } else {
        return of(new HttpResponse({status: 404}));
      }
    }

    return next.handle(request);
  }

  handleEndsWithHeroes(request: HttpRequest<unknown>, method: string) {
    if (method === 'GET')
      return of(new HttpResponse({status: 200, body: HEROES}));
    else if (method === 'POST') {
      const body = request.body as Hero;
      body.id = this.genId();
      return of(new HttpResponse({status: 200, body}));
    } else {
      // else method is PUT
      const body = request.body as Hero;
      const original = request.body[0];
      HEROES.forEach((hero, index) => {
        if (hero.id === original.id) {
          HEROES[index].name = body.name;
        }
      });
      return of(
        new HttpResponse({
          status: 200,
          body: {name: body.name, id: original.id},
        }),
      );
    }
  }

  genId(): number {
    const defaultId = 11;
    return HEROES.length > 0
      ? Math.max(...HEROES.map(hero => hero.id)) + 1
      : defaultId;
  }
}
