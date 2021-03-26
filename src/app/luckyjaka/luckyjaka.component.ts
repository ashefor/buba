import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, TimeoutError } from 'rxjs';
import { GamesService } from '../games/services/games.service';
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-luckyjaka',
  templateUrl: './luckyjaka.component.html',
  styleUrls: ['./luckyjaka.component.scss']
})
export class LuckyjakaComponent implements OnInit {
  alllottoNumbers: any[] = [];
  showBetSlip = false;
  selectedNumbersContainer: any[] = [];
  miniBar = false;
  displayPosition = false;
  position = 'left';
  stake_amount = 100;
  numObj = [];
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
    private loadingBar: LoadingBarService, private router: Router, private title: Title, private currency: CurrencyPipe) {
    this.title.setTitle('Buba - Games | LuckyJaka');
  }

  ngOnInit(): void {
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        
      }
    });
    this.fetchGameSession();
  }

  fetchGameSession() {
    this.loadingBar.start();
    this.loadingDetails = true;
    this.service.fetchLuckyJakaSession().subscribe((data: any) => {
      this.loadingBar.stop();
      this.loadingDetails = false;
      if (data.status === 'success') {
        this.lottoData = data;
        this.allHints = data.hints;
        this.alllottoNumbers.push(data.lucky_jaka.L_1, data.lucky_jaka.L_2, data.lucky_jaka.L_3, data.lucky_jaka.L_4, data.lucky_jaka.L_5, data.lucky_jaka.L_6, data.lucky_jaka.L_7, data.lucky_jaka.L_8, data.lucky_jaka.L_9, data.lucky_jaka.L_10);
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
  selectNumber(number: any) {
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

  buyTickets() {
    const newObj = {} as any;
    this.selectedNumbers.forEach((parentitem, index) => {
      newObj[`L_${index + 1}`] = parentitem;
    });
    const ticketsObj = {
      stake_amount: this.stake_amount,
      ...newObj
    };
    this.loadingBar.start();
    this.buyingTickets = true;
    this.service.buyLuckyJakaTicket(ticketsObj).subscribe((data: any) => {
      this.loadingBar.stop();
      this.buyingTickets = false;
      if (data.status === 'success') {
        if (data.game_status === 1) {
          const message =
            `<p>Winning numbers were <b>${data.win_array}</b> </p>
         <p>You have won <b>${this.currency.transform(data.win_value, '₦')}</b>!, Check your winning balance</p>`;
          this.showSuccessSwal(message);
        } else {
          const message =
            `<p>Winning numbers were <b>${data.win_array}</b> </p>
         <p>But you lost! Try again</p>`;
          this.showLossSwal(message);
        }
        // this.toastr.success(data.message ? data.message : 'Ticket Saved')

      } else {
        this.toastr.error(data.message);
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


  getHintBackgroundColor(argument: string) {
    // tslint:disable-next-line: radix
    const num = parseInt(argument);
    const integer = Math.floor(Math.sqrt(num));
    if (num % 2 === 0) {
      return 'even_count';
    } else if (num % 5 === 0) {
      return 'five_count';
    } else if (num % 7 === 0) {
      return 'seven_count';
    } else if (num % 3 === 0) {
      return 'three_count';
    } else {
      if (num === 2) {
        return 'prime_count';
      } else {
        for (let i = 2; i <= integer; i++) {
          if (integer % i === 0) {
            break;
          }
        }
        return 'prime_count';
      }
    }
  }

  changeGames(event: { target: { value: any; }; }) {
    const url = event.target.value;
    if (url.length) {
      this.router.navigateByUrl(url);
    }
  }

  showSuccessSwal(message) {
    return Swal.fire({
      title: 'Congratulations!',
      html: `${message}`,
      icon: 'success',
      width: '35rem',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Awesome!',
      backdrop: `
      rgba(0,0,123,0.4)
      url("/assets/img/confetti.gif")
      center center
      no-repeat
    `
    });
  }

  showLossSwal(message) {
    return Swal.fire({
      title: 'Loss!',
      html: `${message}`,
      icon: 'error',
      width: '35rem',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Okay',
    });
  }

}
