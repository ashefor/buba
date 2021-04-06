import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Subscription, TimeoutError } from 'rxjs';
import { WithdrawalService } from '../../services/withdrawal.service';

@Component({
  selector: 'app-withdrawal-history',
  templateUrl: './withdrawal-history.component.html',
  styleUrls: ['./withdrawal-history.component.scss']
})
export class WithdrawalHistoryComponent implements OnInit, OnDestroy {
  pagenumber = 1;
  pagesize = 10;
  withdrawalHistory: any[];
  isFetchingHistory: boolean;
  withdrawalSubscription: Subscription;
  searchText = '';
  errorMsg = 'no withdrawals yet';
  constructor(private withdrawalService: WithdrawalService,
              private toastr: ToastrService,
               private title: Title) {
    this.title.setTitle('Buba - Account Withdrawal History');
   }

  ngOnInit(): void {
    this.fetchWithdrawalHistory();
  }

  ngOnDestroy() {
    
  }

  fetchWithdrawalHistory() {
    const pageData = {
      page_number: this.pagenumber,
      page_size: this.pagesize,
      search_text: ''
    };
    
    this.withdrawalSubscription = this.withdrawalService.fetchWithdrawals(pageData).subscribe((data: any) => {
      
      if (data.status === 'success') {
        this.withdrawalHistory = data.withdrawals;
      } else {
        this.toastr.error(data.message);
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
      search_text: this.searchText
    };
    
    this.withdrawalSubscription = this.withdrawalService.fetchWithdrawals(pageData).subscribe((data: any) => {
      
      if (data.status === 'success') {
        this.withdrawalHistory = data.withdrawals;
      } else {
        this.toastr.error(data.message);
      }
      if (!this.withdrawalHistory.length) {
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
