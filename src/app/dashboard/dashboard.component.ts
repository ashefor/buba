import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, TimeoutError } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { loggedInUser } from '../makebid/models/logged-user';
import { BidService } from '../makebid/services/bid.service';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  loadingDetails: boolean;
  isFetchingBids: boolean;
  storedUserDetails$: Observable<any>;
  userdetails: any;
  displayPosition: boolean;
  bidHistory: any[];
  isCreating: boolean;
  isTransferring: boolean;
  badRequestError: any;
  transferFundsForm: FormGroup;
  text = 'Sign up on @bubang now with https://account.buba.ng/register?reffered_by=fola to enjoy more with less'

  constructor(private authService: AuthService,
    private bidService: BidService,
    private toastr: ToastrService,
    private dashboardService: DashboardService, private title: Title, private fb: FormBuilder,
    private loadingBar: LoadingBarService) {
    this.title.setTitle('Buba - Account Dashboard');
  }

  ngOnInit(): void {
    this.storedUserDetails$ = this.authService.getUser$();
    this.fetchUserDetails();
    this.fetchOpenBids();
    this.formInit();
  }

  formInit() {
    this.transferFundsForm = this.fb.group({
      amount: [null, Validators.required],
    });
  }

  get formControls() {
    return this.transferFundsForm.controls;
  }

  ngOnDestroy() {
    this.loadingDetails = false;
    this.isCreating = false;
  }

  openTransferModal() {
    this.displayPosition = true;
  }
  resetModal() {
    this.transferFundsForm.reset();
  }

  fetchUserDetails() {
    this.loadingDetails = true;
    this.authService.getWalletBalance().subscribe((data: loggedInUser) => {
      this.loadingDetails = false;
      this.userdetails = data.user;
      this.bidService.setWalletDetails(data.user);
    }, (error: any) => {
      this.loadingDetails = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // this.bidService.setCurrentPage(2);
        } else {
          this.toastr.error('Server error. Please try again later', 'Error');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Server timed out. Please try again later', 'Time Out!');
      } else {
        this.toastr.error('An unknown error has occured. Please try again later', 'Error');
      }
    });
  }

  fetchOpenBids() {
    this.isFetchingBids = true;
    this.dashboardService.fetchOpenBids().subscribe((data: any) => {
      this.isFetchingBids = false;
      if (data.status === 'success') {
        this.bidHistory = data.bids_history;
      }
    }, (error: any) => {
      this.isFetchingBids = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // this.bidService.setCurrentPage(2);
        } else {
          this.toastr.error('Server error. Please try again later', 'Error');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Server timed out. Please try again later', 'Time Out!');
      } else {
        this.toastr.error('An unknown error has occured. Please try again later', 'Error');
      }
    });
  }

  refreshAccountDetails() {
    this.fetchUserDetails();
  }

  createPaymentAccount() {
    this.isCreating = true;
    this.badRequestError = null;
    this.authService.createPaymentAccount().subscribe((data: any) => {
      this.isCreating = false;
      location.reload();
    }, (error: any) => {
      this.isCreating = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.badRequestError = error.error.message;
        } else if (error.status === 401) {
          this.badRequestError = error.error.message;
        } else {
          this.toastr.error('Please try again', 'Server Error');
        }
      }
    });
  }

  copyTextToClipBoard(inputElement: HTMLInputElement) {
    inputElement.focus();
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, inputElement.value.length);
    this.toastr.info('Copied to clipboard');
  }

  transferFunds(formValue) {
    // tslint:disable-next-line: forin
    for (const i in this.transferFundsForm.controls) {
      this.transferFundsForm.controls[i].markAsDirty();
      this.transferFundsForm.controls[i].updateValueAndValidity();
    }
    if (this.transferFundsForm.invalid) {
      return;
    }
    this.isTransferring = true;
    this.loadingBar.start();
    this.authService.transferFundsToWallet(formValue).subscribe((data: any) => {
      this.loadingBar.stop();
      this.isTransferring = false;
      this.toastr.success(data.message);
      this.displayPosition = false;
      this.refreshAccountDetails();
      this.transferFundsForm.reset();
    }, (error: any) => {
      this.isTransferring = false;
      this.loadingBar.stop();
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          const badRequestError = error.error.message;
          this.transferFundsForm.setErrors({
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
