import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription, TimeoutError } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { GetBidsService } from '../services/get-bids.service';

@Component({
  selector: 'app-bid-history',
  templateUrl: './bid-history.component.html',
  styleUrls: ['./bid-history.component.scss']
})
export class BidHistoryComponent implements OnInit, OnDestroy {

  pagenumber = 1;
  pagesize = 10;
  bidsHistory: any[];
  isFetchingHistory: boolean;
  bidsHistorySubscription: Subscription;
  errorMsg = 'no bids yet';
  constructor(private bidService: GetBidsService, private loadingBar: LoadingBarService, private toastr: ToastrService, private title: Title) {
    this.title.setTitle('Buba - Account Open Bids');
   }

  ngOnInit(): void {
    this.fetchBidsHistory();
  }

  ngOnDestroy() {
    this.loadingBar.stop();
  }

  fetchBidsHistory() {
    const pageData = {
      page_number: this.pagenumber,
      page_size: this.pagesize
    };
    this.loadingBar.start();
    this.bidsHistorySubscription = this.bidService.fetchAllBidHistory(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      if (data.status === 'success') {
        this.bidsHistory = data.bids_history;
      }
    }, (error: any) => {
      this.loadingBar.stop();
      this.isFetchingHistory = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status >= 400 && error.status <= 415) {
          this.toastr.error(error.error.message, 'Error');
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
    this.loadingBar.start();
    this.bidsHistorySubscription = this.bidService.fetchAllBidHistory(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      if (data.status === 'success') {
        this.bidsHistory = data.bids_history;
      }
      if (!this.bidsHistory.length) {
        this.errorMsg = 'no more results';
      }
    }, (error: any) => {
      this.loadingBar.stop();
      this.isFetchingHistory = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status >= 400 && error.status <= 415) {
          this.toastr.error(error.error.message, 'Error');
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
