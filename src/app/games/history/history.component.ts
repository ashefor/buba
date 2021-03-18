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
  gamesPageNumber = 1;
  gamesPageSize = 10;

  spinPageNumber = 1;
  spinPageSize = 10;

  bereketePageNumber = 1;
  bereketePageSize = 10;

  luckyJakaPageNumber = 1;
  luckyJakaPageSize = 10;

  pagenumber = 1;
  pagesize = 10;
  gamesHistory: any[];
  isFetchingHistory: boolean;
  gamesHistorySubscription: Subscription;
  errorMsg = 'no bids yet';
  displayPosition: boolean;
  gameData: any;
  allGamesData: any[] = null;
  spinHistory: any;
  spinErrorMsg: string;
  bereketeHistory: any;
  bereketeErrorMsg: string;
  luckyJakaErrorMsg: string;
  luckyjakaHistory: any;
  constructor(private gamesService: GamesService,
    private loadingBar: LoadingBarService,
    private toastr: ToastrService, private title: Title) {
    this.title.setTitle('Buba - Account Games | History');
  }

  ngOnInit(): void {
    // this.fetchGamesHistory();
    this.fetchHistory();
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

  fetchHistory() {
    const details = {
      games: {
        page_number: this.gamesPageNumber,
        page_size: this.gamesPageSize,
        search_text: '',
      },
      spin: {
        page_number: this.spinPageNumber,
        page_size: this.spinPageSize,
        search_text: '',
      },
      berekete: {
        page_number: this.bereketePageNumber,
        page_size: this.bereketePageSize,
        search_text: '',
      },
      luckyjaka: {
        page_number: this.luckyJakaPageNumber,
        page_size: this.luckyJakaPageSize,
        search_text: '',
      }
    };
    this.loadingBar.start();
    this.gamesService.fetchGamesHistory(details).subscribe((data: any[]) => {
      this.loadingBar.stop();
      this.allGamesData = data;
      this.gamesHistory = this.allGamesData[0].game_history;
      this.spinHistory = this.allGamesData[1].spins;
      this.bereketeHistory = this.allGamesData[2].berekete;
      this.luckyjakaHistory = this.allGamesData[3].lucky_jaka;
    }, (error: any) => {
      this.loadingBar.stop();
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

  goToGamesAnotherPage() {
    const pageData = {
      page_number: this.gamesPageNumber,
      page_size: this.gamesPageSize,
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

  goGamesPrevious() {
    if (this.gamesPageNumber === 1) {
      return;
    } else {
      this.gamesPageNumber -= 1;
      this.goToGamesAnotherPage();
    }
  }

  goGamesNext() {
    this.gamesPageNumber += 1;
    this.goToGamesAnotherPage();
  }

  goToSpinAnotherPage() {
    const pageData = {
      page_number: this.spinPageNumber,
      page_size: this.spinPageSize,
      search_text: ''
    };
    this.loadingBar.start();
    this.gamesService.fetchAllSpinHistory(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      if (data.status === 'success') {
        this.spinHistory = data.spins;
      }
      if (!this.spinHistory.length) {
        this.spinErrorMsg = 'no more results';
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

  goSpinPrevious() {
    if (this.spinPageNumber === 1) {
      return;
    } else {
      this.spinPageNumber -= 1;
      this.goToSpinAnotherPage();
    }
  }

  goSpinNext() {
    this.spinPageNumber += 1;
    this.goToSpinAnotherPage();
  }


  goToBereketeAnotherPage() {
    const pageData = {
      page_number: this.bereketePageNumber,
      page_size: this.bereketePageSize,
      search_text: ''
    };
    this.loadingBar.start();
    this.gamesService.fetchBereketeHistory(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      if (data.status === 'success') {
        this.bereketeHistory = data.berekete;
      }
      if (!this.bereketeHistory.length) {
        this.bereketeErrorMsg = 'no more results';
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

  goBereketePrevious() {
    if (this.bereketePageNumber === 1) {
      return;
    } else {
      this.bereketePageNumber -= 1;
      this.goToBereketeAnotherPage();
    }
  }

  goBereketeNext() {
    this.bereketePageNumber += 1;
    this.goToBereketeAnotherPage();
  }

  goToLuckyJakaAnotherPage() {
    const pageData = {
      page_number: this.luckyJakaPageNumber,
      page_size: this.luckyJakaPageSize,
      search_text: ''
    };
    this.loadingBar.start();
    this.gamesService.fetchBereketeHistory(pageData).subscribe((data: any) => {
      this.loadingBar.stop();
      if (data.status === 'success') {
        this.luckyjakaHistory = data.lucky_jaka;
      }
      if (!this.luckyjakaHistory.length) {
        this.luckyJakaErrorMsg = 'no more results';
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

  goLuckyJakaPrevious() {
    if (this.luckyJakaPageNumber === 1) {
      return;
    } else {
      this.luckyJakaPageNumber -= 1;
      this.goToLuckyJakaAnotherPage();
    }
  }

  goLuckyJakaNext() {
    this.luckyJakaPageNumber += 1;
    this.goToLuckyJakaAnotherPage();
  }

  showMore(bid) {
    this.gameData = bid;
    this.displayPosition = true;
  }
}
