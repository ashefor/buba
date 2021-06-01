import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, TimeoutError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { loggedInUser } from 'src/app/makebid/models/logged-user';
import { BidService } from 'src/app/makebid/services/bid.service';

@Component({
  selector: 'app-payment-account',
  templateUrl: './payment-account.component.html',
  styleUrls: ['./payment-account.component.scss']
})
export class PaymentAccountComponent implements OnInit, OnDestroy {
  isCreating: boolean;
  creatingAcctSubscription = new Subscription();
  confirmPaymentSubscription = new Subscription();
  errorMessage: any;
  processing: boolean;
  accountDetails: any;
  currentPage = 1;
  deposit = null;
  isPaying: boolean;

  constructor(private toastr: ToastrService, 
    private auth: AuthService,  private router: Router, private bidService: BidService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    
    this.creatingAcctSubscription.unsubscribe();
    this.confirmPaymentSubscription.unsubscribe();
  }

  createPaymentAccount() {
    
    this.isCreating = true;
    this.creatingAcctSubscription = this.auth.createPaymentAccount().subscribe((data: any) => {
      this.currentPage = 2;
      
      this.isCreating = false;
      this.accountDetails = data;
    },  (error: any) => {
      this.isCreating = false;
      
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.errorMessage = error.error.message;
          this.toastr.error(error.error.message);
          if (this.errorMessage === 'You can not reserve two accounts with the same reference') {
            this.router.navigate(['/dashboard']);
          }
        } else if (error.status === 401) {
          this.errorMessage = error.error.message;
        } else {
          this.toastr.error('Please try again', 'Server Error');
        }
      }
    });
  }

  confirmPayment() {
    
    this.processing = true;
    this.confirmPaymentSubscription = this.auth.getWalletBalance().subscribe((data: loggedInUser) => {
      
      this.processing = false;
      this.bidService.setWalletDetails(data.user);
      this.auth.storeUser(data.user);
      if (parseFloat(data.user.balance) > 0) {
        this.router.navigate(['/dashboard']);
      } else {
        this.toastr.info('Payment has not reflected yet. Please hold on');
      }
    }, (error: any) => {
      
      this.processing = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          this.bidService.setCurrentPage(2);
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


  makePayment() {
    const details = {
      amount: this.deposit,
      return_url: '/dashboard',
    };
    this.isPaying = true;
    this.bidService.initiatePaystack(details).subscribe((data: any) => {
      if (data.status === 'success') {
        location.href = data.link;
      }
      this.isPaying = false;
    });
  }
}
