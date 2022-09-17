// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Chat} from './chat.model';
import {environment} from '../environments/environment';

const baseUrl = `${environment.BASE_URL}/messages`;
const tenantIdUrl = `${environment.BASE_URL}/userTenantId`;

@Injectable()
export class UserService {
  constructor(private readonly http: HttpClient) {}

  createAuthorizationHeader(headers: HttpHeaders, token: string) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  get(token: string, channelId: string) {
    const authHeader = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.get<Chat[]>(baseUrl, {
      headers: authHeader,
      params: {
        ChannelID: channelId,
      },
    });
  }

  post(message: Chat, token: string) {
    const authHeader = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.post(baseUrl, message, {headers: authHeader});
  }

  getUserTenantId(token: string) {
    const authHeader = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.get(tenantIdUrl, {
      headers: authHeader,
      responseType: 'text',
    });
  }
}
