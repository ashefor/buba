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
  searchText = '';
  errorMsg = 'no funding yet';
  constructor(private fundingService: FundingService,
              private loadingBar: LoadingBarService,
              private toastr: ToastrService, private title: Title) {
    this.title.setTitle('Buba - Account Funding History');
  }

  ngOnInit(): void {
    this.fetchFundingHistory();
  }

  ngOnDestroy() {
    this.loadingBar.stop();
  }

  fetchFundingHistory() {
    const pageData = {
      page_number: this.pagenumber,
      page_size: this.pagesize
    };
    this.loadingBar.start();
    this.fundingHistorySubscription = this.fundingService.fetchTransactions(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      if (data.status === 'successs' || data.status === 'success' ) {
        this.fundingHistory = data.transactions;
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
    this.fundingHistorySubscription = this.fundingService.fetchTransactions(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      if (data.status === 'successs') {
        this.fundingHistory = data.transactions;
      }
      if (!this.fundingHistory.length) {
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
