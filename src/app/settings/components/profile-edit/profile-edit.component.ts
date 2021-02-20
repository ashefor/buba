import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, TimeoutError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { states } from 'src/app/states';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  states: any[] = states;
  state: any = null;
  profileEditForm: FormGroup;
  loading: boolean;
  profileEditSubscription: Subscription;
  userDetails: any;
  
  constructor(private fb: FormBuilder,
              private profileService: ProfileService,
              private toastr: ToastrService, private authService: AuthService, private loadingBar: LoadingBarService, private title: Title) {
                this.title.setTitle('Buba - Account Edit Profile');
               }

  ngOnInit(): void {
    this.authService.getUser$().subscribe((user: any) => {
        this.userDetails = user;
    });
    this.formInit();
  }
  ngOnDestroy() {
    this.loadingBar.stop();
  }

  formInit() {
    this.profileEditForm = this.fb.group({
      firstname: [this.userDetails.firstname, Validators.required],
      lastname: [this.userDetails.lastname, Validators.required],
      address: [this.userDetails.address, Validators.required],
      city: [this.userDetails.city, Validators.required],
      state: [this.userDetails.state, Validators.required],
    });
  }

  get formControls() {
    return this.profileEditForm.controls;
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    const dropdownValue = control.value;
    if (!dropdownValue.name) {
      return { error: true, required: true };
    }
    return {};
  }
  
  editProfileHandler(formvalue) {
    if (this.profileEditForm.invalid) {
      return;
    }
    this.loading = true;
    this.loadingBar.start();
    this.profileEditForm.disable();
    this.profileEditSubscription = this.profileService.editProfileDetails(formvalue).subscribe((profileData: any) => {
      this.profileEditForm.enable();
      this.loading = false;
      this.loadingBar.stop();
      if (profileData.status === 'success') {
        this.toastr.success('Success', profileData.message);
        const newUserDetails = {...this.userDetails, ...formvalue};
        this.authService.storeUser(newUserDetails);
      } else {
        this.toastr.error('Error!', profileData.message);
      }
    }, (error: any) => {
      this.loading = false;
      this.loadingBar.stop();
      this.profileEditForm.enable();
      if (error instanceof HttpErrorResponse) {
        this.toastr.error('Error', error.error ? error.error.error : 'An error has occured. Please try again later');
        if (error.status === 400) {
          const badRequestError = error.error.message;
          this.profileEditForm.setErrors({
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
