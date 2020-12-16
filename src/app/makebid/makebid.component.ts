import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, TimeoutError } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { BidService } from './services/bid.service';

@Component({
  selector: 'app-makebid',
  templateUrl: './makebid.component.html',
  styleUrls: ['./makebid.component.scss']
})
export class MakebidComponent implements OnInit, OnDestroy {
  currentPage$: Observable<number>;
  bidDetails$: Observable<any>;
  accountDetails$: Observable<any>;
  fetchBidErrors: any;
  bidId: string;
  bidList: any;
  bidInfo: any;
  state: false;
  animation = 'animate__slideInRight';
  processing: boolean;
  fetchBidSubscription: Subscription;
  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute, private service: BidService, private loadingBar: LoadingBarService, private auth: AuthService, private toastr: ToastrService, private chref: ChangeDetectorRef, private title: Title) {
    this.title.setTitle('Buba - Complete Bid');
   }

  ngOnInit(): void {
    this.currentPage$ = this.service.getCurrentPage$();
    this.bidDetails$ = this.service.getBidDetails$();
    this.accountDetails$ = this.service.getWalletDetails$();
    this.route.params.subscribe((params: Params) => {
      this.fetchOneBid(params.id);
    });
  }

  ngOnDestroy() {
    this.loadingBar.stop();
    this.fetchBidSubscription.unsubscribe();
  }

  changePage() {
    // this.currentPage += 1;
  }

  handleGoback(page) {
    this.service.setCurrentPage(page);
  }

  goToNextPage(event) {
    this.animation = 'animate__slideInRight';
    this.service.setCurrentPage(3);
  }

  logUserIn(user) {
  }
  fetchOneBid(bidId) {
    this.loadingBar.start();
    this.fetchBidSubscription = this.service.listOneBid(bidId).subscribe((data: any) => {
      this.loadingBar.stop();
      if (data.status === 'success') {
        this.bidInfo = data;
        this.bidList = data.bid_list;
      }
    }, (error: HttpErrorResponse) => {
      this.loadingBar.stop();
      if (error.status === 404) {
        this.fetchBidErrors = error.error.message;
      }
    });
  }


}
