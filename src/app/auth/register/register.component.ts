import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  registerForm: FormGroup;
  isRegistering: boolean;
  hide2 = true;
  registerSubscription = new Subscription();
  constructor(private fb: FormBuilder, private toastr: ToastrService, private bidService: BidService, private loadingBar: LoadingBarService, private auth: AuthService, private router: Router, private title: Title, private activatedRoute: ActivatedRoute, private meta: Meta) {
    this.title.setTitle('Buba - Account Register');
    this.meta.addTags([
      { name: 'keywords', content: 'Buba, Bid, Auction, PS4, PS5, Iphone, iphone, iPhone 12, wig, hair, bone straight', },
      { name: 'description', content: 'Create your Buba account to enjoy More for Less!' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@bubang' },
      {name: 'twitter:title', content: 'Buba Account Sign Up'},
      {name: 'twitter:description', content: 'Create your Buba account with my referral code to enjoy More for Less!'},
    ], true)
   }

  ngOnInit(): void {
    this.registerFormInit();
    this.activatedRoute.queryParams.subscribe((param: Params) => {
      this.registerForm.patchValue({referred_by : param.referred_by})
    })
  }

  registerFormInit() {
    this.registerForm = this.fb.group({
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      phone_number: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmpassword: [null, [this.confirmValidator]],
      referred_by: [null]
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
    }), concatMap(()=> this.auth.createPaymentAccount())).subscribe((newUser: any) => {
      this.loadingBar.stop();
      this.isRegistering = false;
      this.registerForm.enable();
      this.auth.storeUser(newUser.user);
      this.bidService.setWalletDetails(newUser.user);
      this.router.navigate(['/dashboard']);
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
}
