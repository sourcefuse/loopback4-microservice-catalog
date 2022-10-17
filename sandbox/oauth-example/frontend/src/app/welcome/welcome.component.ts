// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import jwt_decode from 'jwt-decode';
import {AuthPayload} from '../auth.model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  token: string;
  payload?: AuthPayload;
  username?: string;
  constructor(private route: ActivatedRoute) {
    this.token = '';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params.code;
      this.payload = jwt_decode(this.token);
      this.username =
        this.payload?.user?.firstName ?? this.payload?.user?.username;
    });
  }
}
