import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, TimeoutError } from 'rxjs';
import { banks } from 'src/app/banks';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit, OnDestroy {
  banks: any[] = banks.sort((a, b) => a.name.localeCompare(b.name));
  // tslint:disable-next-line: variable-name
  addBankAccountForm: FormGroup;
  loading: boolean;
  addBankAccountSubscription: Subscription;
  userDetails: any;

  constructor(private fb: FormBuilder,
              private profileService: ProfileService,
              private toastr: ToastrService,
              private authService: AuthService,  private title: Title) {
    this.title.setTitle('Buba - Account Bank Details');
  }

  ngOnInit(): void {
    this.authService.getUser$().subscribe((user: any) => {
      this.userDetails = user;
  });
    this.formInit();
  }
  ngOnDestroy() {
    
  }

  formInit() {
    this.addBankAccountForm = this.fb.group({
      bank_code: [this.userDetails.bank_code, Validators.required],
      account_number: [this.userDetails.account_number, Validators.required],
    });
  }

  get formControls() {
    return this.addBankAccountForm.controls;
  }

  addBankAccountHandler(formvalue) {
    if (this.addBankAccountForm.invalid) {
      return;
    }
    this.loading = true;
    
    this.addBankAccountForm.disable();
    this.addBankAccountSubscription = this.profileService.addBankAccountDetails(formvalue).subscribe((bankData: any) => {
      this.addBankAccountForm.enable();
      
      this.loading = false;
      if (bankData.status === 'success') {
        const newuser = {...this.userDetails, bank_code: formvalue.bank_code, account_number: formvalue.account_number};
        this.toastr.success('Success', bankData.message);
        this.authService.storeUser(newuser);
      } else {
        this.toastr.error('Error!', bankData.message);
      }
    }, (error: any) => {
      this.loading = false;
      
      this.addBankAccountForm.enable();
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          const badRequestError = error.error.message;
          this.addBankAccountForm.setErrors({
            badRequest: badRequestError
          });
        } else {
          this.toastr.error(error.error ? error.error.message : 'An error has occured. Please try again later');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Server timeout. Please try again later');
      }
    });
  }
}
