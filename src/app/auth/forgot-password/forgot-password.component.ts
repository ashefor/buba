import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { BidService } from 'src/app/makebid/services/bid.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  resetting: boolean;
  showResetForm = true;

  constructor(private fb: FormBuilder, private title: Title, private loadingBar: LoadingBarService, private auth: AuthService, private bidService: BidService, private router: Router) {
    this.title.setTitle('Buba - Account Reset Password');
  }

  ngOnInit(): void {
    this.formInit()
  }

  formInit() {
    this.forgotPasswordForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
    });
  }

  get formControls() {
    return this.forgotPasswordForm.controls;
  }

  get email() {
    return this.forgotPasswordForm.get('email').value;
  }

  reset(formvalue) {
    for (const i in this.forgotPasswordForm.controls) {
      this.forgotPasswordForm.controls[i].markAsDirty();
      this.forgotPasswordForm.controls[i].updateValueAndValidity();
    }
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.loadingBar.start();
    this.resetting = true;
    this.forgotPasswordForm.disable();
    this.auth.resetAccount(formvalue).subscribe((data: any) => {
      this.loadingBar.stop();
      this.resetting = false;
      this.showResetForm = false;
      this.forgotPasswordForm.enable();
    }, (error: any) => {
      this.resetting = false;
      this.loadingBar.stop();
      this.forgotPasswordForm.enable();
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.forgotPasswordForm.setErrors({
            badRequest: error.error.message
          });
        } else if (error.status === 401) {
          this.forgotPasswordForm.setErrors({
            unAuthorized: error.error.message
          });
        }
      }
    })
  }

  displayResetForm() {
    this.forgotPasswordForm.reset();
    this.showResetForm = true;
  }
}
