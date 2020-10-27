import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private authService: AuthService,
              private bidService: BidService, private toastr: ToastrService, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.storedUserDetails$ = this.authService.getUser$();
    console.log(this.storedUserDetails$);
    this.fetchUserDetails();
    this.fetchOpenBids();
  }

  ngOnDestroy() {
    this.loadingDetails = false;
  }

  fetchUserDetails() {
    this.loadingDetails = true;
    this.authService.getWalletBalance().subscribe((data: loggedInUser) => {
      this.loadingDetails = false;
      console.log(data);
      this.userdetails = data.user;
      this.bidService.setWalletDetails(data.user);
    }, (error: any) => {
      this.loadingDetails = false;
      console.log(error);
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
      console.log(data);
    }, (error: any) => {
      this.isFetchingBids = false;
      console.log(error);
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

}
