import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, TimeoutError } from 'rxjs';
import { WithdrawalService } from '../../services/withdrawal.service';

@Component({
  selector: 'app-make-withdrawal',
  templateUrl: './make-withdrawal.component.html',
  styleUrls: ['./make-withdrawal.component.scss']
})
export class MakeWithdrawalComponent implements OnInit, OnDestroy {
  withdrawalForm: FormGroup;
  loading: boolean;
  constructor(private fb: FormBuilder,
              private withdrawalService: WithdrawalService,
              private toastr: ToastrService, private loadingBar: LoadingBarService, private title: Title) {
                this.title.setTitle('Buba - Account New Withdrawal');
               }

  ngOnInit(): void {
    this.initWithdrawalForm();
  }

  ngOnDestroy() {
    this.loadingBar.stop();
  }

  initWithdrawalForm() {
    this.withdrawalForm = this.fb.group({
      amount: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  get formControls() {
    return this.withdrawalForm.controls;
  }


  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    const val = this.unFormat(control.value);
    const newValue = val.slice(1, val.length);
    if (!control.value) {
      return { error: true, required: true };
    } else if (isNaN(newValue)) {
      return { invalidAmount: true, error: true };
    }
    return {};
  }

  format(valString) {
    if (!valString) {
      return '';
    }
    const val = valString.toString();
    const parts = this.unFormat(val).split('.');
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, ',') + (!parts[1] ? '' : '.' + parts[1]);
  }


  unFormat(val) {
    if (!val) {
      return '';
    }
    val = val.replace(/^0+/, '');
    if (val.includes(',')) {
      return val.replace(/,/g, '');
    } else {
      return val.replace(/\./g, '');
    }
  }

  formatLoanAmountInput(e) {
    const val = e.target.value;
    const inputvalue = this.format(val);
    // tslint:disable-next-line: max-line-length
    let newValue: string;

    if (inputvalue) {
      if (inputvalue.length > 1) {
        newValue = `₦${inputvalue.slice(1, inputvalue.length)}`;
      } else if (inputvalue.length === 1) {
        if (inputvalue.includes('₦')) {
          newValue = '';
        } else {
          newValue = `₦${inputvalue.slice(0, inputvalue.length)}`;
        }
      } else {
        newValue = '';
      }
    } else {
      newValue = '';
    }
    this.withdrawalForm.patchValue({ amount: newValue });
  }

  makeWithDrawal(formvalue) {
    // tslint:disable-next-line: forin
    for (const i in this.withdrawalForm.controls) {
      this.withdrawalForm.controls[i].markAsDirty();
      this.withdrawalForm.controls[i].updateValueAndValidity();
    }
    if (this.withdrawalForm.valid) {
      this.loading = true;
      this.loadingBar.start();
      this.withdrawalForm.disable();
      this.withdrawalService.makeWithdrawal(formvalue).subscribe((withdrawalData: any) => {
        this.withdrawalForm.enable();
        this.loading = false;
        this.loadingBar.stop();
        if (withdrawalData.status === 'success') {
          this.toastr.success('Success', withdrawalData.message);
          this.withdrawalForm.reset();
        } else {
          const badRequestError = withdrawalData.message;
          this.withdrawalForm.setErrors({
            badRequest: badRequestError
          });
        }
      }, (error: any) => {
        this.loading = false;
        this.loadingBar.stop();
        this.withdrawalForm.enable();
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            const badRequestError = error.error.message;
            this.withdrawalForm.setErrors({
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
}
