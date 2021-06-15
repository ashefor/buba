import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { loggedInUser } from 'src/app/makebid/models/logged-user';
import { BidService } from 'src/app/makebid/services/bid.service';

// tslint:disable-next-line: class-name
interface registerFormType {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  phone_number: string;
  referred_by: string;
  reg_source?: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  isRegistering: boolean;
  hide2 = true;
  registerSubscription = new Subscription();
  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private bidService: BidService,
              
              private auth: AuthService,
              private router: Router,
              private title: Title, private activatedRoute: ActivatedRoute, private meta: Meta) {
    this.title.setTitle('Buba - Account Register');
    this.meta.updateTag(
      { name: 'description', content: 'Use my link to create your Buba account to enjoy More for Less!' }
    );
    this.meta.updateTag(
      { name: 'twitter:url', content: 'https://buba.ng/register' }
    );
    this.meta.updateTag(
      { name: 'twitter:card', content: 'summary' }
    );
    this.meta.updateTag(
      { name: 'twitter:description', content: 'Use my link to create your Buba account to enjoy More for Less!' }
    );
    this.meta.updateTag(
      { name: 'twitter:card', content: 'summary' },
      `name='twitter:card'`
    );
    this.meta.updateTag(
      {meta: 'property="og:title"', content: 'Buba | Account Register'},
    );
  }

  ngOnInit(): void {
    this.meta.updateTag(
      {meta: 'property="og:title"', content: 'Buba | Account Register'},
    );
    this.meta.updateTag(
      { name: 'twitter:description', content: 'Use my link to create your Buba account to enjoy More for Less!' }
    );
    this.registerFormInit();
    this.activatedRoute.queryParams.subscribe((param: Params) => {
      this.registerForm.patchValue({ referred_by: param.referred_by });
    });
  }
  ngOnDestroy() {
    
    this.registerSubscription.unsubscribe();
  }
  registerFormInit() {
    this.registerForm = this.fb.group({
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      phone_number: [null, [Validators.required, Validators.pattern('(0)[0-9 ]{10}')]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmpassword: [null, [this.confirmValidator]],
      checked: [null, this.underAgeValidator],
      referred_by: ['']
    });
  }
  get registerFormControls() {
    return this.registerForm.controls;
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.registerForm.controls.confirmpassword.updateValueAndValidity());
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }

  underAgeValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value === false) {
      return { error: true, required: true };
    }
    return {}
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
    // 
    this.isRegistering = true;
    this.registerForm.disable();
    const {referred_by} = formvalue;
    const newRefCode = referred_by ? referred_by : '';
    formvalue.referred_by = newRefCode;
    formvalue.reg_source = 'OTHERS';
    this.registerSubscription = this.auth.register(formvalue).subscribe((newUser: any) => {
      this.auth.storeToken(newUser.token);
      // 
      this.isRegistering = false;
      this.registerForm.enable();
      this.auth.storeUser(newUser.user);
      this.bidService.setWalletDetails(newUser.user);
      this.router.navigate(['/payment-account']);
    }, (error: any) => {
      this.isRegistering = false;
      // 
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
}
