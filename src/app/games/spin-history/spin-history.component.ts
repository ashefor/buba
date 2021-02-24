import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Subscription, TimeoutError } from 'rxjs';
import { GamesService } from '../services/games.service';

@Component({
  selector: 'app-spin-history',
  templateUrl: './spin-history.component.html',
  styleUrls: ['./spin-history.component.scss']
})
export class SpinHistoryComponent implements OnInit, OnDestroy {

  pagenumber = 1;
  pagesize = 10;
  spinHistory: any[];
  isFetchingHistory: boolean;
  spinHistorySubscription: Subscription;
  errorMsg = 'no spin yet';
  displayPosition: boolean;
  gameData: any;
  constructor(private gamesService: GamesService,
              private loadingBar: LoadingBarService,
              private toastr: ToastrService, private title: Title) {
    this.title.setTitle('Buba - Account Spin History');
   }

  ngOnInit(): void {
    this.fetchSpinHistory();
  }

  ngOnDestroy() {
    this.loadingBar.stop();
  }

  fetchSpinHistory() {
    const pageData = {
      page_number: this.pagenumber,
      page_size: this.pagesize,
      search_text: ''
    };
    this.loadingBar.start();
    this.spinHistorySubscription = this.gamesService.fetchAllSpinHistory(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      if (data.status === 'success') {
        this.spinHistory = data.spins;
      }
    }, (error: any) => {
      this.loadingBar.stop();
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
      search_text: ''
    };
    this.loadingBar.start();
    this.spinHistorySubscription = this.gamesService.fetchAllSpinHistory(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      if (data.status === 'success') {
        this.spinHistory = data.spins;
      }
      if (!this.spinHistory.length) {
        this.errorMsg = 'no more results';
      }
    }, (error: any) => {
      this.loadingBar.stop();
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

  showMore(bid) {
    this.gameData = bid;
    this.displayPosition = true;
  }
}
