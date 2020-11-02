import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { FundingService } from './services/funding.service';

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.scss']
})
export class FundingComponent implements OnInit, OnDestroy {
  pagenumber = 1;
  pagesize = 10;
  fundingHistory: any[];
  constructor(private fundingService: FundingService, private loadingBar: LoadingBarService, private toastr: ToastrService) { }

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
    this.fundingService.fetchTransactions(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      console.log(data);
      if (data.status === 'successs') {
        this.fundingHistory = data.transactions;
        console.log(this.fundingHistory);
      }
      console.log(this.fundingHistory);
    });
  }
}
