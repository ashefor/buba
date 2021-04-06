import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { FundingService } from './services/funding.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, Subscription, TimeoutError } from 'rxjs';
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
              
              private toastr: ToastrService, private title: Title) {
    this.title.setTitle('Buba - Account Funding History');
  }

  ngOnInit(): void {
    this.fetchFundingHistory();
  }

  ngOnDestroy() {
    
  }

  fetchFundingHistory() {
    const pageData = {
      page_number: this.pagenumber,
      page_size: this.pagesize
    };
    
    this.fundingHistorySubscription = this.fundingService.fetchTransactions(pageData).subscribe((data: any) => {
      
      if (data.status === 'successs' || data.status === 'success' ) {
        this.fundingHistory = data.transactions;
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
    
    this.fundingHistorySubscription = this.fundingService.fetchTransactions(pageData).subscribe((data: any) => {
      
      if (data.status === 'successs') {
        this.fundingHistory = data.transactions;
      }
      if (!this.fundingHistory.length) {
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
