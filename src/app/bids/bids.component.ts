import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription, TimeoutError } from 'rxjs';
import { GetBidsService } from './services/get-bids.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-bids',
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.scss']
})
export class BidsComponent implements OnInit, OnDestroy {
  pagenumber = 1;
  pagesize = 10;
  bidsHistory: any[];
  isFetchingHistory: boolean;
  bidsHistorySubscription: Subscription;
  constructor(private bidService: GetBidsService, private loadingBar: LoadingBarService, private toastr: ToastrService, private title: Title) {
    this.title.setTitle('Buba - Account Bids History');
   }

  ngOnInit(): void {
    this.fetchFundingHistory();
  }

  ngOnDestroy() {
    this.loadingBar.stop();
    this.bidsHistorySubscription.unsubscribe();
  }

  fetchFundingHistory() {
    const pageData = {
      page_number: this.pagenumber,
      page_size: this.pagesize
    };
    this.loadingBar.start();
    this.bidsHistorySubscription = this.bidService.fetchTransactions().subscribe((data: any) => {
      this.loadingBar.stop();
      console.log(data);
      if (data.status === 'success') {
        this.bidsHistory = data.bids_history;
        console.log(this.bidsHistory);
      }
    }, (error: any) => {
      this.loadingBar.stop();
      this.isFetchingHistory = false;
      console.log(error);
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
}
