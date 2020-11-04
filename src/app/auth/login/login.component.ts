import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
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
  loginSubscription = new Subscription();
  constructor(private fb: FormBuilder, private loadingBar: LoadingBarService, private auth: AuthService, private bidService: BidService, private router: Router) { }

  ngOnInit(): void {
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
    }, {
      updateOn: 'blur'
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  logIn(formvalue) {
    const newFormValue = {} as loginFormType;
    const { email, password } = formvalue;
    newFormValue.param = email;
    newFormValue.password = password;
    // console.log(newFormValue);
    this.loadingBar.start();
    this.loggingIn = true;
    this.loginForm.disable();
    this.loginSubscription = this.auth.login(newFormValue).subscribe((loggedUser: loggedInUser) => {
      this.loadingBar.stop();
      this.loggingIn = false;
      this.loginForm.enable();
      this.auth.storeToken(loggedUser.token);
      this.auth.storeUser(loggedUser.user);
      console.log(loggedUser);
      // this.loginEmitter.emit();
      this.router.navigate(['/dashboard']);
      this.bidService.setWalletDetails(loggedUser.user);
    }, (error: any) => {
      this.loggingIn = false;
      this.loadingBar.stop();
      this.loginForm.enable();
      // console.log(error);
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
