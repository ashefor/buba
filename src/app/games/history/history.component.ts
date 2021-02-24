import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, Subscription, TimeoutError } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { GamesService } from '../services/games.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
  pagenumber = 1;
  pagesize = 10;
  gamesHistory: any[];
  isFetchingHistory: boolean;
  gamesHistorySubscription: Subscription;
  errorMsg = 'no bids yet';
  displayPosition: boolean;
  gameData: any;
  constructor(private gamesService: GamesService,
              private loadingBar: LoadingBarService,
              private toastr: ToastrService, private title: Title) {
    this.title.setTitle('Buba - Account Games History');
   }

  ngOnInit(): void {
    this.fetchGamesHistory();
  }

  ngOnDestroy() {
    this.loadingBar.stop();
  }

  fetchGamesHistory() {
    const pageData = {
      page_number: this.pagenumber,
      page_size: this.pagesize,
      search_text: '',
    };
    this.loadingBar.start();
    this.gamesHistorySubscription = this.gamesService.fetchAllGamesHistory(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      if (data.status === 'success') {
        this.gamesHistory = data.game_history;
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
    };
    this.loadingBar.start();
    this.gamesHistorySubscription = this.gamesService.fetchAllGamesHistory(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      if (data.status === 'success') {
        this.gamesHistory = data.game_history;
      }
      if (!this.gamesHistory.length) {
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
