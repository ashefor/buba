import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, TimeoutError } from 'rxjs';
import { arrayFive, arrayFour, arrayOne, arrayThree, arrayTwo, resetArray } from '../models/games';
import { GamesService } from '../services/games.service';

@Component({
  selector: 'app-quick-play',
  templateUrl: './quick-play.component.html',
  styleUrls: ['./quick-play.component.scss']
})
export class QuickPlayComponent implements OnInit {

  alllottoNumbers: any[] = [];
  arrayOne = arrayOne;
  arrayTwo = arrayTwo;
  arrayThree = arrayThree;
  arrayFour = arrayFour;
  arrayFive = arrayFive;
  showBetSlip = false;
  selectedNumbersContainer: any[] = [];
  miniBar = false;
  displayPosition = false;
  // tslint:disable-next-line: variable-name
  stake_amount: any[] = [];
  selectedNumbers = [...resetArray];
  lottoData: any;
  animation = 'animate__slideInRight';
  allHints: any;
  buyingTickets: boolean;
  loadingDetails: boolean;
  openSide: boolean;
  ticketData: any;
  disablePlayButton: boolean;

  constructor(private service: GamesService,
              private toastr: ToastrService, private loadingBar: LoadingBarService, private router: Router, private title: Title) {
                this.title.setTitle('Buba - Games | Quick Play');
               }

  ngOnInit(): void {
    this.fetchGameSession();
  }

  fetchGameSession() {
    this.loadingBar.start();
    this.loadingDetails = true;
    this.service.fetchQuickPlaySession().subscribe((data: any) => {
      this.loadingBar.stop();
      this.loadingDetails = false;
      if (data.status === 'success') {
        this.lottoData = data;
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
  selectNumber(selectedNumber) {
    const {value, label, index} = selectedNumber;
    this.selectedNumbers[index] = selectedNumber;
    const foundIndex = this.selectedNumbers.findIndex(num => num === selectedNumber);
  }

  addToSlip() {
    const newSelectedNumbers = [...this.selectedNumbers.map(item => item.label)]
    this.selectedNumbersContainer.push(newSelectedNumbers);
    this.stake_amount.push(100);
    this.selectedNumbers = [...resetArray];
  }

  showSideBar() {
    this.showBetSlip = true;
    setTimeout(() => {
      this.miniBar = true;
    }, 100);
    setTimeout(() => {
      this.openSide = true;
    }, 400);
  }

  closeSideBar() {
    this.miniBar = false;
    setTimeout(() => {
      this.openSide = false;
      this.showBetSlip = false;
    }, 400);
  }

  clearGameSlip() {
    this.miniBar = false;
    setTimeout(() => {
      this.openSide = false;
      this.showBetSlip = false;
      this.selectedNumbers = resetArray;
      this.stake_amount = [];
      this.selectedNumbersContainer = [];
    }, 400);
  }

  // tslint:disable-next-line: variable-name
  getBackgroundColor(number: any) {
    const foundIndex = this.selectedNumbers.findIndex(num => num === number);
    if (foundIndex === -1) {
      if (this.selectedNumbers.length === 5) {
        return false;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  removeFromSlip(index) {
    this.selectedNumbersContainer.splice(index, 1);
    this.stake_amount.splice(index, 1);
    if (this.selectedNumbersContainer.length === 0) {
      this.clearGameSlip();
    }
  }

  buyTickets() {
    const tickets = [];
    this.selectedNumbersContainer.forEach((parentitem: [], itemindex) => {
      const newObj = {} as any;
      parentitem.forEach((item, index) => {
        newObj[`L_${index + 1}`] = item;
      });
      tickets.push({ ...newObj, amount: this.stake_amount[itemindex] });
    });
    const ticketsObj = {
      session_id: this.lottoData.session_id,
      tickets
    };
    this.buyingTickets = true;
    this.service.buyQuickPlayTickets(ticketsObj).subscribe((data: any) => {
      this.loadingBar.stop();
      this.buyingTickets = false;
      if (data.status === 'success') {
        this.ticketData = {
          ticket_id: data.ticket_id,
          total_amt: tickets.reduce((acc, { amount }) => acc + amount, 0)
        };
        this.displayPosition = true;
        // this.toastr.success(data.message ? data.message : 'Ticket Saved')
        setTimeout(() => {
          this.miniBar = false;
          this.showBetSlip = false;
        }, 100);
        this.selectedNumbersContainer = [];
        this.stake_amount = [];
        this.selectedNumbers = [];
      } else {
        this.toastr.error(data.message)
      }
    }, (error: any) => {
      this.buyingTickets = false;
      this.loadingBar.stop();
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

  get totalStakeAmount() {
    return this.stake_amount.reduce((acc, item) => acc + item, 0)
  }

  get disableAddButton() {
    return this.selectedNumbers.includes(null);
  }

  changeAmount(event) {
   if (event < 100) {
     this.disablePlayButton = true;
   } else {
    this.disablePlayButton = false;
   }
  }

  changeGames(event) {
    const url = event.target.value;
    if (url.length) {
      this.router.navigateByUrl(url);
    }
  }
}
