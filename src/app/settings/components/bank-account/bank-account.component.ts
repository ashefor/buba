import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, TimeoutError } from 'rxjs';
import { banks } from 'src/app/banks';
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
  addBankAccountSubscription = new Subscription();
  constructor(private fb: FormBuilder,
              private profileService: ProfileService,
              private toastr: ToastrService, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.formInit();
  }
ngOnDestroy() {
  this.loadingBar.stop();
  this.addBankAccountSubscription.unsubscribe();
}

  formInit() {
    this.addBankAccountForm = this.fb.group({
      bank_code: [null, Validators.required],
      account_number: [null, Validators.required],
    });
  }

  get formControls() {
    return this.addBankAccountForm.controls;
  }

  addBankAccountHandler(formvalue) {
    if (this.addBankAccountForm.invalid) {
      return;
    }
    console.log(formvalue);
    const {bank_code} = formvalue;
    formvalue.bank_code = bank_code.bankcode;
    console.log(formvalue);
    this.loading = true;
    this.loadingBar.start();
    this.addBankAccountForm.disable();
    this.addBankAccountSubscription = this.profileService.addBankAccountDetails(formvalue).subscribe((bankData: any) => {
      this.addBankAccountForm.enable();
      this.loadingBar.stop();
      this.loading = false;
      console.log(bankData);
      if (bankData.status === 'success') {
        this.toastr.success('Success', bankData.message);
        this.addBankAccountForm.reset();
      } else {
        this.toastr.error('Error!', bankData.message);
      }
    }, (error: any) => {
      this.loading = false;
      this.loadingBar.stop();
      this.addBankAccountForm.enable();
      console.log(error);
      if (error instanceof HttpErrorResponse) {
        this.toastr.error('Error', error.error ? error.error.error : 'An error has occured. Please try again later');
        if (error.status === 400) {
          console.log(error.error);
          const badRequestError = error.error.message;
          this.addBankAccountForm.setErrors({
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
