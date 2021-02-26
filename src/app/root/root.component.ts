import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, TimeoutError } from 'rxjs';
import { RouterService } from '../core/services/router.service';
import { GamesService } from '../games/services/games.service';
import { BidService } from '../makebid/services/bid.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
  isSpinning = false;
  spinData: any;
  fetchBidErrors: any;
  entries: any[];
  miniBar = false;
  selectedEntry = null;
  loadingDetails: boolean;
  showBetSlip: boolean;
  openSide: boolean;
  currentPage$: Observable<number>;
  bidDetails$: Observable<any>;
  animation = 'animate__slideInRight';
  accountDetails$: Observable<any>;
  showStepper: boolean;
  showBidStepper: boolean;
  gameType: string;

  constructor(private service: GamesService,
              private bidservice: BidService,
              private currency: CurrencyPipe,
              private toastr: ToastrService,
              private loadingBar: LoadingBarService,
              private routeStatus: RouterService,
              private title: Title) { }

  ngOnInit(): void {
    this.currentPage$ = this.bidservice.getCurrentPage$();
    this.bidDetails$ = this.bidservice.getBidDetails$();
    this.accountDetails$ = this.bidservice.getWalletDetails$();
    this.fetchSpinItems();
  }

  fetchSpinItems() {
    this.loadingDetails = true;
    this.loadingBar.start();
    this.service.fetchSpinItems().subscribe((data: any) => {
      this.loadingBar.stop();
      this.loadingDetails = false;
      if (data.status === 'success') {
        this.spinData = data;
        this.entries = data.product;
      }
    }, (error: any) => {
      this.loadingBar.stop();
      this.loadingDetails = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          return EMPTY;
        } else if (error.status === 400) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Unknown error. Please try again later');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Server timed out. Please try again later', 'Time Out!');
      } else {
        this.toastr.error('An unknown error has occured. Please try again later');
      }
    });
  }

  handleGoback(page) {
    this.bidservice.setCurrentPage(page);
  }

  goToNextPage(event) {
    this.animation = 'animate__slideInRight';
    this.bidservice.setCurrentPage(3);
  }

  startBidProcess() {
    this.gameType = 'bid';
    this.routeStatus.setRouteStatus(null);
    this.showStepper = true;
    this.showBidStepper = true;
  }

  startSpinProcess() {
    this.gameType = 'spin';
    this.routeStatus.setRouteStatus(4);
    this.bidservice.setCurrentPage(3);
    this.showStepper = true;
    this.showBidStepper = false;
  }

  resetBid() {
    this.showStepper = false;
    this.bidservice.setCurrentPage(1);
  }

  togglePlayOptions() {
    this.showStepper = false;
  }
}
