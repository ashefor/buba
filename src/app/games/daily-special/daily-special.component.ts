import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { TimeoutError } from 'rxjs';
import { GamesService } from '../services/games.service';

@Component({
  selector: 'app-daily-special',
  templateUrl: './daily-special.component.html',
  styleUrls: ['./daily-special.component.scss']
})
export class DailySpecialComponent implements OnInit {
  alllottoNumbers: any[] = [];
  showBetSlip = false;
  selectedNumbersContainer: any[] = [];
  miniBar = false;
  displayPosition = false;
  position = 'left'
  stake_amount: any[] = [];
  selectedNumbers: any[] = [];
  lottoData: any;
  animation = 'animate__slideInRight';
  allHints: any;
  buyingTickets: boolean;
  loadingDetails: boolean;
  openSide: boolean;
  ticketData: any;
  disablePlayButton: boolean;
  constructor(private service: GamesService,
              private toastr: ToastrService,
              private loadingBar: LoadingBarService, private router: Router) { }

  ngOnInit(): void {
    this.fetchGameSession();
  }

  fetchGameSession() {
    this.loadingBar.start();
    this.loadingDetails = true;
    this.service.fetchDailySpecialSession().subscribe((data: any) => {
      this.loadingBar.stop();
      this.loadingDetails = false;
      if (data.status === 'success') {
        this.lottoData = data;
        this.allHints = data.hints;
        this.alllottoNumbers.push(data.numbers.A_1, data.numbers.B_1, data.numbers.C_1, data.numbers.D_1, data.numbers.E_1, data.numbers.F_1, data.numbers.G_1, data.numbers.H_1, data.numbers.I_1, data.numbers.J_1)
      }
    }, (error: any) => {
      this.loadingBar.stop();
      this.loadingDetails = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status >= 400 && error.status <= 415) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Unknown error. Please try again later');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Server timed out. Please try again later', 'Time Out!');
      } else {
        this.toastr.error('An unknown error has occured. Please try again later');
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
    this.stake_amount.push(100);
    this.selectedNumbers = [];
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
      this.selectedNumbers = [];
      this.stake_amount = [];
      this.selectedNumbersContainer = [];
    }, 400);
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
      session_id: this.allHints.session_id,
      tickets
    };
    this.buyingTickets = true;
    this.service.buyTickets(ticketsObj).subscribe((data: any) => {
      this.loadingBar.stop();
      this.buyingTickets = false;
      if (data.status === 'success') {
        this.ticketData = {
          ticket_id: data.ticket_id,
          total_amt: tickets.reduce((acc, {amount}) => acc + amount, 0)
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
        if (error.status >= 400 && error.status <= 415) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Unknown error. Please try again later');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Server timed out. Please try again later', 'Time Out!');
      } else {
        this.toastr.error('An unknown error has occured. Please try again later');
      }
    })
  }

  get totalStakeAmount() {
    return this.stake_amount.reduce((acc, item) => acc + item, 0)
  }

  getHintBackgroundColor(argument) {
    const number = parseInt(argument)
    const integer = Math.floor(Math.sqrt(number));
    if (number % 2 === 0) {
      return 'even_count'
    } else if (number % 5 === 0) {
      return 'five_count'
    } else if (number % 7 === 0) {
      return 'seven_count'
    } else if (number % 3 === 0) {
      return 'three_count'
    } else {
      if (number === 2) {
        return 'prime_count'
      } else {
        for (let i = 2; i <= integer; i++) {
          if (integer % i === 0) {
            break
          }
        }
        return 'prime_count';
      }
    }
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
