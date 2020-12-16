import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, TimeoutError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  changePasswordForm: FormGroup;
  loading: boolean;
  changePasswordSubscription = new Subscription();
  constructor(private fb: FormBuilder,
              private profileService: ProfileService,
              private toastr: ToastrService,  private loadingBar: LoadingBarService, private title: Title) { 
                this.title.setTitle('Buba - Account Change Password');
              }

  ngOnInit(): void {
    this.formInit();
  }

  ngOnDestroy() {
    this.loadingBar.stop();
    this.changePasswordSubscription.unsubscribe();
  }
  formInit() {
    this.changePasswordForm = this.fb.group({
      old_password: [null, [Validators.required, Validators.minLength(6)]],
      new_password: [null, [Validators.required, Validators.minLength(6)]],
      password_confirmation: [null, [Validators.required, this.confirmaPasswordValidator]],
    });
  }

  get formControls() {
    return this.changePasswordForm.controls;
  }

  updateConfirmPasswordValidator(): void {
    Promise.resolve().then(() => this.changePasswordForm.controls.password_confirmation.updateValueAndValidity());
  }
  confirmaPasswordValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.changePasswordForm.controls.new_password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }

  changePasswordHandler(formvalue) {
    const { new_password, old_password } = formvalue;
    const newFormvalue = { new_password, old_password };
    this.loading = true;
    this.loadingBar.start();
    this.changePasswordForm.disable();
    this.changePasswordSubscription = this.profileService.changeUserPassword(newFormvalue).subscribe((passwordData: any) => {
      this.changePasswordForm.enable();
      this.loading = false;
      this.loadingBar.stop();
      if (passwordData.status === 'success') {
        this.toastr.success('Success', passwordData.message);
        this.changePasswordForm.reset();
      } else {
        this.toastr.error('Error!', passwordData.message);
      }
    }, (error: any) => {
      this.loading = false;
      this.changePasswordForm.enable();
      this.loadingBar.stop();
      if (error instanceof HttpErrorResponse) {
        this.toastr.error('Error', error.error ? error.error.error : 'An error has occured. Please try again later');
        if (error.status === 400) {
          const badRequestError = error.error.message;
        
          this.changePasswordForm.setErrors({
            badRequest: badRequestError
          });
        } else {
          this.toastr.error(error.error ? error.error.error : 'An error has occured. Please try again later', 'Error');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Time Out!', 'Server timeout. Please try again later');
      }
    });
  }
}
