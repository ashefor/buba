import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Subscription } from 'rxjs';
import { concatMap, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { bidDetails } from '../../models/bid-details';
import { loggedInUser } from '../../models/logged-user';
import { BidService } from '../../services/bid.service';

// tslint:disable-next-line: class-name
interface loginFormType {
  param: string;
  password: string;
}


// tslint:disable-next-line: class-name
interface registerFormType {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  phone_number: string;
}

@Component({
  selector: 'app-stepper-two',
  templateUrl: './stepper-two.component.html',
  styleUrls: ['./stepper-two.component.scss']
})

export class StepperTwoComponent implements OnInit, OnDestroy {
  @Input() animation: any;
  @Input() bidDetails: bidDetails;
  @Output() loginEmitter = new EventEmitter();
  hide = true;
  hide2 = true;
  authType = 1;
  loginSubscription = new Subscription();
  loginForm: FormGroup;
  registerForm: FormGroup;
  resetForm: FormGroup;
  loggingIn: boolean;
  isRegistering: boolean;
  isResetting: boolean;
  registerSubscription = new Subscription();;
  constructor(private fb: FormBuilder, private loadingBar: LoadingBarService, private auth: AuthService, private bidService: BidService) { }

  ngOnInit(): void {
    this.formInit();
    this.registerFormInit();
    this.resetFormInit();
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

  resetFormInit() {
    this.resetForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]]
    });
  }
  registerFormInit() {
    this.registerForm = this.fb.group({
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      phone_number: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  get registerFormControls() {
    return this.registerForm.controls;
  }

  get resetFormControls() {
    return this.registerForm.controls;
  }

  logIn(formvalue) {
    if (this.loginForm.invalid) {
      return;
    }
    const newFormValue = {} as loginFormType;
    const { email, password } = formvalue;
    newFormValue.param = email;
    newFormValue.password = password;
    console.log(newFormValue);
    this.loadingBar.start();
    this.loggingIn = true;
    this.loginForm.disable();
    this.loginSubscription = this.auth.login(newFormValue).subscribe((loggedUser: loggedInUser) => {
      this.loadingBar.stop();
      this.loggingIn = false;
      this.loginForm.enable();
      this.auth.storeToken(loggedUser.token);
      // this.loginEmitter.emit();
      console.log(loggedUser);
      console.log(this.bidDetails);
      this.bidDetails.wallet_balance = loggedUser.user.balance;
      this.bidService.setBidDetails(this.bidDetails);
      console.log(this.bidDetails);
      if (parseFloat(loggedUser.user.balance) < parseFloat(this.bidDetails.total_amount)) {
        this.bidService.setCurrentPage(3);
      } else {
        this.bidService.setCurrentPage(4);
      }
    }, (error: any) => {
      this.loggingIn = false;
      this.loadingBar.stop();
      this.loginForm.enable();
      console.log(error);
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

  toggleFormType(type) {
    this.authType = type;
  }

  register(formvalue: registerFormType) {
    if (this.registerForm.invalid) {
      return;
    }
    console.log(formvalue);
    this.loadingBar.start();
    this.isRegistering = true;
    this.registerForm.disable();
    this.registerSubscription = this.auth.register(formvalue).pipe(tap((data: loggedInUser) => {
      this.auth.storeToken(data.token);
     }), concatMap(() => this.auth.createPaymentAccount()), concatMap(() => this.auth.getWalletBalance())).subscribe((newUser: any) => {
      this.loadingBar.stop();
      this.isRegistering = false;
      this.registerForm.enable();
      // this.auth.storeToken(newUser.token);
      // this.loginEmitter.emit();
      console.log(newUser);
      // this.bidDetails.wallet_balance = newUser.user.balance;
      this.bidService.setBidDetails(this.bidDetails);
      this.bidService.setWalletDetails(newUser.user);
      console.log(this.bidDetails);
      this.bidService.setCurrentPage(3);
    }, (error: any) => {
      this.isRegistering = false;
      this.loadingBar.stop();
      this.registerForm.enable();
      console.log(error);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.registerForm.setErrors({
            badRequest: error.error.message
          });
        } else if (error.status === 401) {
          this.registerForm.setErrors({
            unAuthorized: error.error.message
          });
        }
      }
    });
  }

  reset(formvalue) {

  }
}
