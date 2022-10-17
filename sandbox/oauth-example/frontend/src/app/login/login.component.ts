// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthService,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Empty
  }

  get f() {
    return this.loginForm.controls;
  }

  validateForm() {
    if (!this.loginForm.value.username || !this.loginForm.value.password) {
      alert('All fields must be filled');
      return false;
    }
    return true;
  }

  onSubmit() {
    this.submitted = true;

    if (!this.validateForm() && this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['welcome'], {
            queryParams: {code: data.code},
          });
        },
        error => {
          this.loading = false;
        },
      );
  }

  loginViaGoogle() {
    this.authenticationService.loginViaGoogle();
  }

  loginViaFacebook() {
    this.authenticationService.loginViaFacebook();
  }

  loginViaAzure() {
    this.authenticationService.loginViaAzure();
  }
}
