import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
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
  @Output() goBackEmitter = new EventEmitter();
  hide = true;
  hide2 = true;
  authType = 1;
  loginSubscription: Subscription;
  loginForm: FormGroup;
  registerForm: FormGroup;
  resetForm: FormGroup;
  loggingIn: boolean;
  isRegistering: boolean;
  isResetting: boolean;
  registerSubscription: Subscription;
  showResetForm = true;
  constructor(private fb: FormBuilder, private loadingBar: LoadingBarService, private auth: AuthService, private bidService: BidService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.formInit();
    this.registerFormInit();
    this.resetFormInit();
  }

  ngOnDestroy() {
    this.loadingBar.stop();
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
      phone_number: [null, [Validators.required, Validators.pattern("(0)[0-9 ]{10}")]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      referred_by: [null]
    });
  }

  get resetEmail() {
    return this.resetForm.get('email').value;
  }

  get formControls() {
    return this.loginForm.controls;
  }

  get registerFormControls() {
    return this.registerForm.controls;
  }

  get resetFormControls() {
    return this.resetForm.controls;
  }

  logIn(formvalue) {
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
      this.bidDetails.wallet_balance = loggedUser.user.balance;
      this.bidService.setBidDetails(this.bidDetails);
      this.bidService.setWalletDetails(loggedUser.user);
      if (parseFloat(loggedUser.user.balance) < parseFloat(this.bidDetails.total_amount)) {
        this.bidService.setCurrentPage(3);
      } else {
        this.bidService.setCurrentPage(4);
      }
    }, (error: any) => {
      this.loggingIn = false;
      this.loadingBar.stop();
      this.loginForm.enable();
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
    // tslint:disable-next-line: forin
    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity();
    }
    if (this.registerForm.invalid) {
      return;
    }
    this.loadingBar.start();
    this.isRegistering = true;
    this.registerForm.disable();
    this.registerSubscription = this.auth.register(formvalue).pipe(tap((data: loggedInUser) => {
      this.auth.storeToken(data.token);
     }), concatMap(() => this.auth.createPaymentAccount()), concatMap(() => this.auth.getWalletBalance())).subscribe((newUser: any) => {
      this.loadingBar.stop();
      this.isRegistering = false;
      this.registerForm.enable();
      this.auth.storeUser(newUser.user);
      this.bidService.setBidDetails(this.bidDetails);
      this.bidService.setWalletDetails(newUser.user);
      this.bidService.setCurrentPage(3);
    }, (error: any) => {
      this.isRegistering = false;
      this.loadingBar.stop();
      this.registerForm.enable();
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.registerForm.setErrors({
            badRequest: error.error.message
          });
        } else if (error.status === 401) {
          this.registerForm.setErrors({
            unAuthorized: error.error.message
          });
        } else {
          this.toastr.error('Please try again', 'Server Error');
        }
      }
    });
  }

  reset(formvalue) {
    for (const i in this.resetForm.controls) {
      this.resetForm.controls[i].markAsDirty();
      this.resetForm.controls[i].updateValueAndValidity();
    }
    if (this.resetForm.invalid) {
      return;
    }
    this.loadingBar.start();
    this.isResetting = true;
    this.resetForm.disable();
    this.auth.resetAccount(formvalue).subscribe((data: any) => {
      this.loadingBar.stop();
      this.isResetting = false;
      this.showResetForm = false;
      this.resetForm.enable();
    }, (error: any) => {
      this.isResetting = false;
      this.loadingBar.stop();
      this.resetForm.enable();
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.resetForm.setErrors({
            badRequest: error.error.message
          });
        } else if (error.status === 401) {
          this.resetForm.setErrors({
            unAuthorized: error.error.message
          });
        }
      }
    })
  }

  displayResetForm() {
    this.resetForm.reset();
    this.showResetForm = true;
  }
  goBack() {
    this.goBackEmitter.emit(1);
  }
}
