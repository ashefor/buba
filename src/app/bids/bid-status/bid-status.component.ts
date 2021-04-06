import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, TimeoutError } from 'rxjs';
import { BidService } from 'src/app/makebid/services/bid.service';
import { WithdrawalService } from 'src/app/withdrawal/services/withdrawal.service';

@Component({
  selector: 'app-bid-status',
  templateUrl: './bid-status.component.html',
  styleUrls: ['./bid-status.component.scss']
})
export class BidStatusComponent implements OnInit, OnDestroy {
  bidStatusForm: FormGroup;
  loading: boolean;
  ticketDetails: any;
  bidSubscription: Subscription;
  constructor(private fb: FormBuilder,
    private bidService: BidService,
    private toastr: ToastrService,  private title: Title) {
      this.title.setTitle('Buba | Bid Status')
     }

  ngOnInit(): void {
    this.initStatusForm();
  }

  initStatusForm() {
    this.bidStatusForm = this.fb.group({
      ticket_id: [null, [Validators.required]],
    });
  }
  ngOnDestroy() {
    
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
      this.ticketDetails = null;
      
      this.bidStatusForm.disable();
      this.bidSubscription = this.bidService.checkBidStatus(formvalue).subscribe((bidData: any) => {
        this.bidStatusForm.enable();
        this.loading = false;
        
        if (bidData.status === 'success') {
          // this.toastr.success('Success', bidData.message);
          // this.bidStatusForm.reset();
          this.ticketDetails = bidData.ticket;
        } else {
          const badRequestError = bidData.message;
          this.bidStatusForm.setErrors({
            badRequest: badRequestError
          });
        }
      }, (error: any) => {
        this.loading = false;
        
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
