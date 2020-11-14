import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, TimeoutError } from 'rxjs';
import { WithdrawalService } from '../../services/withdrawal.service';

@Component({
  selector: 'app-withdrawal-history',
  templateUrl: './withdrawal-history.component.html',
  styleUrls: ['./withdrawal-history.component.scss']
})
export class WithdrawalHistoryComponent implements OnInit, OnDestroy {
  pagenumber = 1;
  pagesize = 10;
  withdawalHistory: any[];
  isFetchingHistory: boolean;
  withdrawalSubscription: Subscription;
  constructor(private withdrawalService: WithdrawalService, private toastr: ToastrService, private loadingBar: LoadingBarService, private title: Title) {
    this.title.setTitle('Buba - Account Withdrawal History');
   }

  ngOnInit(): void {
    this.fetchWithdrawalHistory();
  }

  ngOnDestroy() {
    this.loadingBar.stop();
    this.withdrawalSubscription.unsubscribe();
  }

  fetchWithdrawalHistory() {
    const pageData = {
      page_number: this.pagenumber,
      page_size: this.pagesize,
      search_text: ''
    };
    console.log(pageData);
    this.loadingBar.start();
    this.withdrawalSubscription = this.withdrawalService.fetchWithdrawals(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      console.log(data);
      if (data.status === 'success') {
        this.withdawalHistory = data.withdrawals;
        console.log(this.withdawalHistory);
      } else {
        this.toastr.error(data.message);
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
