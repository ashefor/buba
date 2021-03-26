import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, TimeoutError } from 'rxjs';
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
  displayTransferModal: boolean;
  displayLoyaltyTransferModal: boolean;
  displayPromoModal: boolean;
  displayFundModal: boolean;
  displayLoyaltyWithdrawModal: boolean;
  displayAccountModal: boolean;
  bidHistory: any[];
  isCreating: boolean;
  isTransferring: boolean;
  isAdding: boolean;
  badRequestError: any;
  transferFundsForm: FormGroup;
  promoCodeForm: FormGroup;
  fundWalletForm: FormGroup;
  loyaltyTransferForm: FormGroup;
  loyaltyWithdrawForm: FormGroup;
  userDetailSubscription: Subscription;
  openBidsSubscription: Subscription;
  createAccountSubscription: Subscription;
  transferSubscription: Subscription;
  deposit: any;
  isPaying: boolean;
  isWithdrawing: boolean;
  constructor(private authService: AuthService,
              private bidService: BidService,
              private toastr: ToastrService,
              private dashboardService: DashboardService, private router: Router, private title: Title, private fb: FormBuilder,
              private loadingBar: LoadingBarService) {
    this.title.setTitle('Buba - Account Dashboard');
  }

  ngOnInit(): void {
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        
      }
    });
    this.storedUserDetails$ = this.authService.getUser$();
    this.fetchUserDetails();
    this.fetchOpenBids();
    this.formInit();
    this.promoFormInit();
    this.fundWalletFormInit();
    this.loyaltyTransferFormInit();
    this.loyaltyWithdrawFormInit();
  }

  formInit() {
    this.transferFundsForm = this.fb.group({
      amount: [null, Validators.required],
    });
  }

  promoFormInit() {
    this.promoCodeForm = this.fb.group({
      code: [null, Validators.required],
    });
  }

  fundWalletFormInit() {
    this.fundWalletForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(100)]],
    });
  }

  loyaltyTransferFormInit() {
    this.loyaltyTransferForm = this.fb.group({
      amount: [null, [Validators.required]],
    });
  }

  loyaltyWithdrawFormInit() {
    this.loyaltyWithdrawForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(100)]],
      password: [null, [Validators.required]],
    });
  }

  get formControls() {
    return this.transferFundsForm.controls;
  }

  get promoFormControls() {
    return this.promoCodeForm.controls;
  }

  get fundWalletFormControls() {
    return this.fundWalletForm.controls;
  }

  get loyaltyTransferFormControls() {
    return this.loyaltyTransferForm.controls;
  }

  get loyaltyWithdrawFormControls() {
    return this.loyaltyWithdrawForm.controls;
  }

  ngOnDestroy() {
    this.loadingDetails = false;
    this.isCreating = false;
    this.isTransferring = false;
    this.isAdding = false;
    this.loadingBar.complete();
  }

  openTransferModal() {
    this.displayTransferModal = true;
  }

  openPromoModal() {
    this.displayPromoModal = true;
  }

  openFundModal() {
    this.displayFundModal = true;
  }

  openLoyaltyTransferModal() {
    this.displayLoyaltyTransferModal = true;
  }

  openLoyaltyWithdrawModal() {
    this.displayLoyaltyWithdrawModal = true;
  }

  resetModal() {
    this.transferFundsForm.reset();
  }

  resetPromoModal() {
    this.promoCodeForm.reset();
  }

  resetFundModal() {
    this.fundWalletForm.reset();
  }

  resetLoyaltyTransferModal() {
    this.loyaltyTransferForm.reset();
  }

  resetLoyaltyWithdrawModal() {
    this.loyaltyWithdrawForm.reset();
  }

  fetchUserDetails() {
    this.loadingDetails = true;
    this.userDetailSubscription = this.authService.getWalletBalance().subscribe((data: loggedInUser) => {
      this.loadingDetails = false;
      this.userdetails = data.user;
      this.authService.storeUser(data.user);
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
    this.openBidsSubscription = this.dashboardService.fetchOpenBids().subscribe((data: any) => {
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
    this.createAccountSubscription = this.authService.createPaymentAccount().subscribe((data: any) => {
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
    this.transferSubscription = this.authService.transferFundsToWallet(formValue).subscribe((data: any) => {
      this.loadingBar.stop();
      this.isTransferring = false;
      this.toastr.success(data.message);
      this.displayTransferModal = false;
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

  redeemPromoCode(formValue) {
    // tslint:disable-next-line: forin
    for (const i in this.promoCodeForm.controls) {
      this.promoCodeForm.controls[i].markAsDirty();
      this.promoCodeForm.controls[i].updateValueAndValidity();
    }
    if (this.promoCodeForm.invalid) {
      return;
    }
    this.isAdding = true;
    this.loadingBar.start();
    this.authService.redeemPromoCode(formValue).subscribe((data: any) => {
      this.loadingBar.stop();
      this.isAdding = false;
      this.toastr.success(data.message);
      this.displayPromoModal = false;
      this.refreshAccountDetails();
      this.promoCodeForm.reset();
    }, (error: any) => {
      this.isAdding = false;
      this.loadingBar.stop();
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          const badRequestError = error.error.message;
          this.promoCodeForm.setErrors({
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

  makePayment(formValue) {
    // this.userDetails$.subscribe(user => {
    //   // this.flutterwave.inlinePay(this.paymentData);
    // })
    Object.keys(this.fundWalletForm.controls).forEach(key => {
      this.fundWalletForm.controls[key].markAsDirty();
      this.fundWalletForm.controls[key].updateValueAndValidity();
    });
    if (this.fundWalletForm.invalid) {
      return;
    } else {
      const details = {
        amount: formValue.amount,
        return_url: this.router.url,
      };
      this.isPaying = true;
      this.fundWalletForm.disable();
      this.bidService.initiateFlutterwave(details).subscribe((data: any) => {
        if (data.status === 'success') {
          location.href = data.link;
        }
        this.isPaying = false;
      }, err => {
        this.isPaying = false;
        this.fundWalletForm.disable();
      });
    }
  }

  loyaltyTransferFunds(formValue) {
    Object.keys(this.loyaltyTransferForm.controls).forEach(key => {
      this.loyaltyTransferForm.controls[key].markAsDirty();
      this.loyaltyTransferForm.controls[key].updateValueAndValidity();
    });
    if (this.loyaltyTransferForm.invalid) {
      return;
    }
    this.isTransferring = true;
    this.loadingBar.start();
    this.authService.transferLoyaltyToWallet(formValue).subscribe((data: any) => {
      this.loadingBar.stop();
      this.isTransferring = false;
      this.toastr.success(data.message);
      this.displayLoyaltyTransferModal = false;
      this.refreshAccountDetails();
      this.loyaltyTransferForm.reset();
    }, (error: any) => {
      this.isTransferring = false;
      this.loadingBar.stop();
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          const badRequestError = error.error.message;
          this.loyaltyTransferForm.setErrors({
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

  loyaltyWithdrawFunds(formvalue) {
    // tslint:disable-next-line: forin
    for (const i in this.loyaltyWithdrawForm.controls) {
      this.loyaltyWithdrawForm.controls[i].markAsDirty();
      this.loyaltyWithdrawForm.controls[i].updateValueAndValidity();
    }
    if (this.loyaltyWithdrawForm.valid) {
      this.isWithdrawing = true;
      this.loadingBar.start();
      this.loyaltyWithdrawForm.disable();
      this.authService.withdrawLoyaltyBalance(formvalue).subscribe((withdrawalData: any) => {
        this.loyaltyWithdrawForm.enable();
        this.isWithdrawing = false;
        this.loadingBar.stop();
          this.toastr.success(withdrawalData.message);
          this.loyaltyWithdrawForm.reset();
          this.refreshAccountDetails();
          this.displayLoyaltyWithdrawModal = false;
      }, (error: any) => {
        this.isWithdrawing = false;
        this.loadingBar.stop();
        this.loyaltyWithdrawForm.enable();
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            const badRequestError = error.error.message;
            this.loyaltyWithdrawForm.setErrors({
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
