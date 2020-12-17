import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { TimeoutError } from 'rxjs';
import { WithdrawalService } from 'src/app/withdrawal/services/withdrawal.service';

@Component({
  selector: 'app-bid-status',
  templateUrl: './bid-status.component.html',
  styleUrls: ['./bid-status.component.scss']
})
export class BidStatusComponent implements OnInit, OnDestroy {
  bidStatusForm: FormGroup;
  loading: boolean;
  constructor(private fb: FormBuilder,
    private withdrawalService: WithdrawalService,
    private toastr: ToastrService, private loadingBar: LoadingBarService, private title: Title) { }

  ngOnInit(): void {
    this.initStatusForm()
  }

  initStatusForm() {
    this.bidStatusForm = this.fb.group({
      bid_id: [null, [Validators.required]],
    });
  }
  ngOnDestroy() {
    this.loadingBar.stop();
  }

  get formControls() {
    return this.bidStatusForm.controls;
  }

  checkBidStatus(formvalue) {
    // tslint:disable-next-line: forin
    for (const i in this.bidStatusForm.controls) {
      this.bidStatusForm.controls[i].markAsDirty();
      this.bidStatusForm.controls[i].updateValueAndValidity();
    }
    if (this.bidStatusForm.valid) {
      this.loading = true;
      this.loadingBar.start();
      this.bidStatusForm.disable();
      this.withdrawalService.makeWithdrawal(formvalue).subscribe((withdrawalData: any) => {
        this.bidStatusForm.enable();
        this.loading = false;
        this.loadingBar.stop();
        if (withdrawalData.status === 'success') {
          this.toastr.success('Success', withdrawalData.message);
          this.bidStatusForm.reset();
        } else {
          const badRequestError = withdrawalData.message;
          this.bidStatusForm.setErrors({
            badRequest: badRequestError
          });
        }
      }, (error: any) => {
        this.loading = false;
        this.loadingBar.stop();
        this.bidStatusForm.enable();
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            const badRequestError = error.error.message;
            this.bidStatusForm.setErrors({
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
