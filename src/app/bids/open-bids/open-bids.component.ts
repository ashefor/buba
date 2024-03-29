import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, Subscription, TimeoutError } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { GetBidsService } from '../services/get-bids.service';

@Component({
  selector: 'app-open-bids',
  templateUrl: './open-bids.component.html',
  styleUrls: ['./open-bids.component.scss']
})
export class OpenBidsComponent implements OnInit,OnDestroy {

  pagenumber = 1;
  pagesize = 10;
  bidsHistory: any[];
  isFetchingHistory: boolean;
  bidsHistorySubscription: Subscription;
  errorMsg = 'no bids yet';
  constructor(private bidService: GetBidsService,  private toastr: ToastrService, private title: Title) {
    this.title.setTitle('Buba - Account Open Bids');
   }

  ngOnInit(): void {
    this.fetchBidsHistory();
  }

  ngOnDestroy() {
    
  }

  fetchBidsHistory() {
    const pageData = {
      page_number: this.pagenumber,
      page_size: this.pagesize
    };
    
    this.bidsHistorySubscription = this.bidService.fetchOpenBids().subscribe((data: any) => {
      
      if (data.status === 'success') {
        this.bidsHistory = data.bids_history;
      }
    }, (error: any) => {
      
      this.isFetchingHistory = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          return EMPTY;
        } else if (error.status === 400) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Unknown error. Please try again later', 'Error');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Server timed out. Please try again later', 'Time Out!');
      } else {
        this.toastr.error('An unknown error has occured. Please try again later', 'Error');
      }
    });
  }

  goToAnotherPage() {
    const pageData = {
      page_number: this.pagenumber,
      page_size: this.pagesize,
    };
    
    this.bidsHistorySubscription = this.bidService.fetchOpenBids().subscribe((data: any) => {
      
      if (data.status === 'successs') {
        this.bidsHistory = data.bids_history;;
      }
      if (!this.bidsHistory.length) {
        this.errorMsg = 'no more results';
      }
    }, (error: any) => {
      
      this.isFetchingHistory = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          return EMPTY;
        } else if (error.status === 400) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Unknown error. Please try again later', 'Error');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Server timed out. Please try again later', 'Time Out!');
      } else {
        this.toastr.error('An unknown error has occured. Please try again later', 'Error');
      }
    });
  }

  goPrevious() {
    if (this.pagenumber === 1) {
      return;
    } else {
      this.pagenumber -= 1;
      this.goToAnotherPage();
    }
  }

  goNext() {
    this.pagenumber += 1;
    this.goToAnotherPage();
  }

}
