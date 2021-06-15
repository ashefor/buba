import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
  urlParams: any;
  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private auth: AuthService,
              private bidService: BidService, private router: Router, private title: Title, private routerServices: RouterService) {
    this.title.setTitle('Buba - Account Login');
    this.activatedRoute.queryParams.subscribe((urlparam: any) => {
      this.urlParams = urlparam;
    })
  }

  ngOnInit(): void {
    this.returnUrl = this.routerServices.getPreviousUrl();
    this.formInit();
  }

  ngOnDestroy() {
    // 
    this.loginSubscription.unsubscribe();
  }
  formInit() {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
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
    const { username, password } = formvalue;
    newFormValue.param = username;
    newFormValue.password = password;
    // 
    this.loggingIn = true;
    this.loginForm.disable();
    this.loginSubscription = this.auth.login(newFormValue).subscribe((loggedUser: loggedInUser) => {
      // 
      this.loggingIn = false;
      this.loginForm.enable();
      this.auth.storeToken(loggedUser.token);
      this.auth.storeUser(loggedUser.user);
      this.bidService.setWalletDetails(loggedUser.user);
      if (loggedUser.login_status === 0) {
        if (Object.keys(this.urlParams).length > 0) {
          const redirectUrl = this.urlParams.redirect;
          this.router.navigateByUrl(redirectUrl);
          // if (this.returnUrl && this.returnUrl.length) {
          //   this.router.navigateByUrl(this.returnUrl);
          // } else {
          //   this.router.navigate(['/lobby']);
          // }
        } else {
          this.router.navigate(['/lobby']);
        }
      } else {
        // this.auth.storeLoginStatus(true);
        this.router.navigate(['/payment-account']);
      }
    }, (error: any) => {
      // 
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
