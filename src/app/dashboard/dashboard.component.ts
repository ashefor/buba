import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
  bidHistory: any[];
  isCreating: boolean;
  badRequestError: any;

  constructor(private authService: AuthService,
              private bidService: BidService, private toastr: ToastrService, private dashboardService: DashboardService, private title: Title) {
                this.title.setTitle('Buba - Account Dashboard');
               }

  ngOnInit(): void {
    this.storedUserDetails$ = this.authService.getUser$();
    this.fetchUserDetails();
    this.fetchOpenBids();
  }

  ngOnDestroy() {
    this.loadingDetails = false;
    this.isCreating = false;
  }

  fetchUserDetails() {
    this.loadingDetails = true;
    this.authService.getWalletBalance().subscribe((data: loggedInUser) => {
      this.loadingDetails = false;
      this.userdetails = data.user;
      console.log(data);
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
    },  (error: any) => {
      this.isCreating = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.badRequestError = error.error.message
        } else if (error.status === 401) {
          this.badRequestError = error.error.message
        } else {
          this.toastr.error('Please try again', 'Server Error');
        }
      }
    })
  }
}
