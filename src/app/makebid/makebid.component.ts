import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, TimeoutError } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  // noBanner = false;
  noBanner = true;
  fetchBidErrors: any;
  bidId: string;
  bidList: any;
  bidInfo: any;
  state: false;
  animation = 'animate__slideInRight';
  processing: boolean;
  fetchBidSubscription: Subscription;
  gameType = 'bid';
  buyTicket: boolean;
  productName: string;
  ticketDetails$:  Observable<any>;
  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute, private service: BidService,  private auth: AuthService, private toastr: ToastrService, private router: Router, private chref: ChangeDetectorRef, private title: Title) {
    this.title.setTitle('Buba - Complete Bid');
    this.productName = environment.productName;
  }

  ngOnInit(): void {
    
    this.currentPage$ = this.service.getCurrentPage$();
    this.bidDetails$ = this.service.getBidDetails$();
    this.ticketDetails$ = this.service.getBidDetails$();
    this.accountDetails$ = this.service.getWalletDetails$();
    this.route.params.subscribe((params: Params) => {
      if (params.id === 'buy-tickets') {
        // this.fetchOneBid(params.id);
        this.buyTicket = true;
        this.gameType = 'buy-ticket';
      } else {
        this.fetchOneBid(params.id);
      }
    });
  }

  closeBanner(event) {
    this.noBanner = event;
  }
  ngOnDestroy() {
    
    this.service.setCurrentPage(1);
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
    
    this.fetchBidSubscription = this.service.listOneBid(bidId).subscribe((data: any) => {
      
      if (data.status === 'success') {
        this.bidInfo = data;
        this.bidList = data.bid_list;
      }
    }, (error: HttpErrorResponse) => {
      
      if (error.status === 404) {
        this.fetchBidErrors = error.error.message;
      }
    });
  }


}
