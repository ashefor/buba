import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private withdrawalService: WithdrawalService, private toastr: ToastrService, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.fetchWithdrawalHistory();
  }

  ngOnDestroy() {
    this.loadingBar.stop();
  }

  fetchWithdrawalHistory() {
    const pageData = {
      page_number: this.pagenumber,
      page_size: this.pagesize,
      search_text: ''
    };
    console.log(pageData);
    this.loadingBar.start();
    this.withdrawalService.fetchWithdrawals(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      console.log(data);
      if (data.status === 'success') {
        this.withdawalHistory = data.transactions;
        console.log(this.withdawalHistory);
      } else {
        this.toastr.error(data.message);
      }
    });
  }
}
