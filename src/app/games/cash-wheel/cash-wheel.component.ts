import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { GamesService } from '../services/games.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, TimeoutError } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-cash-wheel',
  templateUrl: './cash-wheel.component.html',
  styleUrls: ['./cash-wheel.component.scss']
})
export class CashWheelComponent implements OnInit, OnDestroy {
  isSpinning = false;
  stake_amount = 100;
  showExtraBtns: boolean;
  showRetryBtn: boolean;
  retryData: any;
  errorMessage: boolean;

  constructor(private service: GamesService,
    private currency: CurrencyPipe,
    private router: Router,
    private toastr: ToastrService, private loadingBar: LoadingBarService, private title: Title, private auth: AuthService) {
    this.title.setTitle('Buba - Account Games | Berekete');
  }

  ngOnInit(): void {
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {

      }
    });
  }

  ngOnDestroy() {
    this.loadingBar.stop();
  }

  startSpin(element: HTMLElement) {
    Swal.fire({
      html: `Spin with <b> ${this.currency.transform(this.stake_amount, '₦')}</b>?`,
      icon: 'question',
      width: '35rem',
      showCancelButton: true,
      confirmButtonText: 'Yes, Spin!',
      cancelButtonText: 'No, Thank You'
    }).then((result) => {
      if (result.value) {
        let count = 0;
        this.isSpinning = true;
        setTimeout(() => {
          element.classList.remove('new');
          element.classList.add('show');
        }, 50);
        const spinDetails = {
          stake_amount: this.stake_amount,
        };
        this.loadingBar.start();
        this.service.startBereketeSpinSession(spinDetails).subscribe((data: any) => {
          this.loadingBar.stop();
          this.retryData = data;
          element.addEventListener('animationiteration', () => {
            count += 1;
            if (this.retryData.status === 'success') {
              if (count > 1) {
                element.classList.remove('show');
                element.classList.add('new');
                if (this.retryData.spin_status === 0) {
                  count = 0;
                  element.style.setProperty('--transformEnd', '80deg');
                } else if (this.retryData.spin_status === 1) {
                  count = 0;
                  element.style.setProperty('--transformEnd', '120deg');
                } else if (this.retryData.spin_status === 2) {
                  count = 0;
                  element.style.setProperty('--transformEnd', '160deg');
                } else if (this.retryData.spin_status === 3) {
                  count = 0;
                  element.style.setProperty('--transformEnd', '200deg');
                } else if (this.retryData.spin_status === 4) {
                  count = 0;
                  element.style.setProperty('--transformEnd', '40deg');
                } else if (this.retryData.spin_status === 5) {
                  count = 0;
                  element.style.setProperty('--transformEnd', '280deg');
                } else if (this.retryData.spin_status === 6) {
                  count = 0;
                  element.style.setProperty('--transformEnd', '320deg');
                } else if (this.retryData.spin_status === 7) {
                  count = 0;
                  element.style.setProperty('--transformEnd', '240deg');
                } else {
                  count = 0;
                  element.style.setProperty('--transformEnd', '360deg');
                }
                element.style.animationPlayState = 'running';
              }
              return;
            } else {
              this.errorMessage = true;
              element.classList.remove('show');
              this.loadingBar.stop();
              this.showExtraBtns = true;
              this.isSpinning = false;
              this.toastr.error(data.message);
            }
          });
          element.addEventListener('animationend', () => {
            this.showExtraBtns = true;
            this.isSpinning = false;
            if (this.retryData.spin_status === 4) {
              // this.showRetryBtn = true;
              this.showRetrySwal();
            } else if (this.retryData.spin_status === 1) {
              const message = `You have won <b>${this.currency.transform((100 * this.stake_amount), '₦')}</b>!, Check your winning balance`;
              this.showSuccessSwal(message);
            } else if (this.retryData.spin_status === 2) {
              const message = `You have won <b>${this.currency.transform((50 * this.stake_amount), '₦')}</b>!, Check your winning balance`;
              this.showSuccessSwal(message);
            } else if (this.retryData.spin_status === 3) {
              const message = `You have won <b>${this.currency.transform((25 * this.stake_amount), '₦')}</b>!, Check your winning balance`;
              this.showSuccessSwal(message);
            } else if (this.retryData.spin_status === 5) {
              const message = `You have won <b>${this.currency.transform((5 * this.stake_amount), '₦')}</b>!, Check your winning balance`;
              this.showSuccessSwal(message);
            } else if (this.retryData.spin_status === 6) {
              const message = `You have won <b>${this.currency.transform((2 * this.stake_amount), '₦')}</b>!, Check your winning balance`;
              this.showSuccessSwal(message);
            } else {
              this.showLossSwal();
            }
            return this.retryData = null;
          });
        }, (error: any) => {
          this.errorMessage = true;
          element.classList.remove('show');
          this.loadingBar.stop();
          this.showExtraBtns = true;
          this.isSpinning = false;
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
    });
  }

  retrySpin(element: HTMLElement) {

  }

  resetSpinner(element: HTMLElement) {
    element.style.setProperty('--transformEnd', '0deg');
    this.isSpinning = false;
    this.showExtraBtns = false;
    this.retryData = null;
    // this.selectedEntry = null;
  }

  showRetrySwal() {
    return Swal.fire({
      title: 'Congratulations!',
      text: 'You get to spin again for free!',
      icon: 'success',
      width: '35rem',
      showCancelButton: false,
      showConfirmButton: false,
      timer: 2500
    });
  }

  showSuccessSwal(message) {
    return Swal.fire({
      title: 'Congratulations!',
      html: message,
      icon: 'success',
      width: '35rem',
      showCancelButton: false,
      showConfirmButton: false,
      timer: 2500,
      backdrop: `
      rgba(0,0,123,0.4)
      url("/assets/img/confetti.gif")
      center center
      no-repeat
    `
    });
  }

  showLossSwal() {
    return Swal.fire({
      title: 'Loss!',
      text: 'You lost! Try again',
      icon: 'error',
      width: '35rem',
      showCancelButton: false,
      showConfirmButton: false,
      timer: 2500,
    });
  }
}
