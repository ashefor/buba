import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { RouterService } from 'src/app/core/services/router.service';
import { loggedInUser } from 'src/app/makebid/models/logged-user';
import { BidService } from 'src/app/makebid/services/bid.service';

// tslint:disable-next-line: class-name
interface loginFormType {
  param: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  hide = true;
  loginForm: FormGroup;
  loggingIn: boolean;
  returnUrl: any;
  loginSubscription = new Subscription();
  constructor(private fb: FormBuilder,
              private loadingBar: LoadingBarService,
              private auth: AuthService,
              private bidService: BidService, private router: Router, private title: Title, private routerServices: RouterService) {
    this.title.setTitle('Buba - Account Login');
  }

  ngOnInit(): void {
    this.returnUrl = this.routerServices.getPreviousUrl();
    this.formInit();
  }

  ngOnDestroy() {
    this.loadingBar.stop();
    this.loginSubscription.unsubscribe();
  }
  formInit() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  logIn(formvalue) {
    // tslint:disable-next-line: forin
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (this.loginForm.invalid) {
      return;
    }
    const newFormValue = {} as loginFormType;
    const { email, password } = formvalue;
    newFormValue.param = email;
    newFormValue.password = password;
    this.loadingBar.start();
    this.loggingIn = true;
    this.loginForm.disable();
    this.loginSubscription = this.auth.login(newFormValue).subscribe((loggedUser: loggedInUser) => {
      this.loadingBar.stop();
      this.loggingIn = false;
      this.loginForm.enable();
      this.auth.storeToken(loggedUser.token);
      this.auth.storeUser(loggedUser.user);
      this.bidService.setWalletDetails(loggedUser.user);
      if (loggedUser.login_status === 0) {
        if (this.auth.redirectUrl) {
          this.router.navigateByUrl(this.auth.redirectUrl);
        } else if (this.routerServices.getRouteStatus() === 1) {
          if (this.returnUrl && this.returnUrl.length) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.router.navigate(['/dashboard']);
        }
      } else {
        // this.auth.storeLoginStatus(true);
        this.router.navigate(['/payment-account']);
      }
    }, (error: any) => {
      this.loadingBar.stop();
      this.loginForm.enable();
      this.loggingIn = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.loginForm.setErrors({
            badRequest: error.error.message
          });
        } else if (error.status === 401) {
          this.loginForm.setErrors({
            unAuthorized: error.error.message
          });
        }
      }
    });
  }
}
