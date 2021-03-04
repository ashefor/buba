import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { RouterService } from '../core/services/router.service';
import { GamesService } from '../games/services/games.service';
import { BidService } from '../makebid/services/bid.service';

@Component({
  selector: 'app-cash-spin-landing',
  templateUrl: './cash-spin-landing.component.html',
  styleUrls: ['./cash-spin-landing.component.scss']
})
export class CashSpinLandingComponent implements OnInit {
  isSpinning = false;
  currentPage$: Observable<number>;
  animation = 'animate__slideInRight';
  gameType = 'berekete';
  showStepper: boolean;
  stakeAmount: any;

  constructor(private bidservice: BidService) { }

  ngOnInit(): void {
    this.currentPage$ = this.bidservice.getCurrentPage$();
    this.bidservice.setCurrentPage(3);
  }

  handleGoback(page) {
    this.bidservice.setCurrentPage(page);
  }

  setStakeAmount(value) {
    this.stakeAmount = value;
  }
}
