import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { TimeoutError } from 'rxjs';
import { hints } from './models/hints';
import { GamesService } from './services/games.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  allLotteryNumbers: any[] = [];
  showBetSlip = false;
  selectedNumbersContainer: any[] = [];
  miniBar = false;
  stake_amount: any[] = [];
  selectedNumbers: any[] = [];
  lotteryData: any;
  animation = 'animate__slideInRight';
  allHints: any;
  buyingTickets: boolean;
  loadingDetails: boolean;
  openSide: boolean;

  constructor(private service: GamesService, private toastr: ToastrService, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.fetchGameSession();
  }

  fetchGameSession() {
    this.loadingBar.start();
    this.loadingDetails = true;
    this.service.fetchGameSession().subscribe((data: any) => {
      this.loadingBar.stop();
      this.loadingDetails = false;
      console.log(data);
      if (data.status === 'success') {
        this.lotteryData = data;
        this.allHints = data.hints;
        this.allLotteryNumbers.push(data.numbers.A_1, data.numbers.B_1, data.numbers.C_1, data.numbers.D_1, data.numbers.E_1, data.numbers.F_1, data.numbers.G_1, data.numbers.H_1, data.numbers.I_1, data.numbers.J_1)
      }
    }, (error: any) => {
      this.loadingBar.stop();
      this.loadingDetails = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status >= 400 && error.status <= 415) {
          this.toastr.error(error.error.message, 'Error');
        } else {
          this.toastr.error('Unknown error. Please try again later', 'Error');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Server timed out. Please try again later', 'Time Out!');
      } else {
        this.toastr.error('An unknown error has occured. Please try again later', 'Error');
      }
    })

  }
  selectNumber(number) {
    const foundIndex = this.selectedNumbers.findIndex(num => num === number);
    if (foundIndex === -1) {
      if (this.selectedNumbers.length === 5) {
        return;
      } else {
        this.selectedNumbers.push(number);
      }
    } else {
      this.selectedNumbers.splice(foundIndex, 1);
    }
  }

  addToSlip() {
    const newSelectedNumbers = [...this.selectedNumbers]
    this.selectedNumbersContainer.push(newSelectedNumbers);
    this.stake_amount.push(50);
    this.selectedNumbers = [];
  }

  showSideBar() {
    this.showBetSlip = true;
    setTimeout(() => {
      this.miniBar = true;
    }, 100);
    setTimeout(() => {
      this.openSide = true;
    }, 500);
  }

  closeSideBar() {
    this.miniBar = false;
    setTimeout(() => {
      this.openSide = false;
      this.showBetSlip = false;
    }, 500);
  }

  clearGameSlip() {
    this.miniBar = false;
    setTimeout(() => {
      this.openSide = false;
      this.showBetSlip = false;
      this.selectedNumbers = [];
      this.stake_amount = [];
      this.selectedNumbersContainer = [];
    }, 500);
  }

  getBackgroundColor(number) {
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
      // this.stake_amount = [];
      // this.miniBar = false;
      // setTimeout(() => {
      //   this.showBetSlip = false;
      // }, 100);
      this.clearGameSlip();
    }
  }

  changeAmt(index, event) {
  }

  buyTickets() {
    const tickets = [];
    this.selectedNumbersContainer.forEach((parentitem: [], itemindex) => {
      const newObj = {} as any;
      parentitem.forEach((item, index) => {
        newObj[`L_${index + 1}`] = item
      })
      tickets.push({ ...newObj, amount: this.stake_amount[itemindex] });
    })
    const ticketsObj = {
      session_id: this.allHints.session_id,
      tickets: tickets
    }
    // console.log(ticketsObj)
    this.buyingTickets = true;
    this.service.buyTickets(ticketsObj).subscribe((data: any) => {
      this.loadingBar.stop();
      this.buyingTickets = false;
      console.log(data);
      if (data.status === 'success') {
        this.toastr.success(data.message ? data.message: 'Ticket Saved')
        setTimeout(() => {
          this.miniBar = false;
          this.showBetSlip = false;
        }, 100);
        // setTimeout(() => {
        //   this.showBetSlip = false;
        // }, 100);
        this.selectedNumbersContainer = [];
        this.stake_amount = [];
        this.selectedNumbers = [];
      }
    }, (error: any) => {
      this.buyingTickets = false;
      this.loadingBar.stop();
      if (error instanceof HttpErrorResponse) {
        if (error.status >= 400 && error.status <= 415) {
          this.toastr.error(error.error.message, 'Error');
        } else {
          this.toastr.error('Unknown error. Please try again later', 'Error');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Server timed out. Please try again later', 'Time Out!');
      } else {
        this.toastr.error('An unknown error has occured. Please try again later', 'Error');
      }
    })
  }

  get totalStakeAmount() {
    return this.stake_amount.reduce((acc, item) => acc + item, 0)
  }
}