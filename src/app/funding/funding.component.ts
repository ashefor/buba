import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { FundingService } from './services/funding.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription, TimeoutError } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.scss']
})
export class FundingComponent implements OnInit, OnDestroy {
  pagenumber = 1;
  pagesize = 10;
  fundingHistory: any[];
  isFetchingHistory: boolean;
  fundingHistorySubscription: Subscription;
  constructor(private fundingService: FundingService, private loadingBar: LoadingBarService, private toastr: ToastrService, private title: Title) {
    this.title.setTitle('Buba - Account Funding History');
   }

  ngOnInit(): void {
    this.fetchFundingHistory();
  }

  ngOnDestroy() {
    this.loadingBar.stop();
    this.fundingHistorySubscription.unsubscribe();
  }

  fetchFundingHistory() {
    const pageData = {
      page_number: this.pagenumber,
      page_size: this.pagesize
    };
    this.loadingBar.start();
    this.fundingHistorySubscription = this.fundingService.fetchTransactions(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      console.log(data);
      if (data.status === 'successs') {
        this.fundingHistory = data.transactions;
        console.log(this.fundingHistory);
      }
      console.log(this.fundingHistory);
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
