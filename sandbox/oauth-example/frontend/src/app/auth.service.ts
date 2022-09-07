// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';

const localAuthUrl = environment.API_URL + `auth/login`;
const googleAuthUrl = environment.API_URL + `auth/google`;
const facebookAuthUrl = environment.API_URL + `auth/facebook`;
const azureAuthUrl = environment.API_URL + `auth/azure`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  createAuthorizationHeader(headers: HttpHeaders, token: string) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  login(username: string, password: string) {
    return this.http.post<{code: string}>(localAuthUrl, {
      username: username,
      password: password,
      client_id: 'test_client_id',
      client_secret: 'test_client_secret',
    });
  }

  oAuthLogin(url: string) {
    const myform = document.createElement('form');
    const body = {
      client_id: 'test_client_id',
      client_secret: 'test_client_secret',
    };
    myform.method = 'POST';
    myform.action = url;
    myform.style.display = 'none';
    myform.append('Content-Type', 'application/x-www-form-urlencoded');
    Object.keys(body).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input.value = (body as any)[key]; //NOSONAR
      myform.appendChild(input);
    });
    document.body.appendChild(myform);
    myform.submit();
  }

  loginViaGoogle() {
    this.oAuthLogin(googleAuthUrl);
  }

  loginViaFacebook() {
    this.oAuthLogin(facebookAuthUrl);
  }

  loginViaAzure() {
    this.oAuthLogin(azureAuthUrl);
  }
}
