import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, Subscription, TimeoutError } from 'rxjs';
import { GamesService } from '../services/games.service';
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { loggedInUser } from 'src/app/makebid/models/logged-user';

@Component({
  selector: 'app-raffle-draw',
  templateUrl: './raffle-draw.component.html',
  styleUrls: ['./raffle-draw.component.scss'],
})
export class RaffleDrawComponent implements OnInit, OnDestroy {
  isSpinning = false;
  entries: any[];
  selectedEntry = null;
  loadingDetails: boolean;
  spinData: any;
  errorMessage: boolean;
  retryData: any;
  showExtraBtns: boolean;
  showRetryBtn: boolean;
  fetchSubscription: Subscription;
  spinSubscription: Subscription;

  constructor(private service: GamesService,
              private currency: CurrencyPipe,
              private router: Router,
              private toastr: ToastrService,  private title: Title, private auth: AuthService) {
    this.title.setTitle('Buba - Games | Buba Spin');
  }

  ngOnInit(): void {
    
    this.fetchSpinItems();
  }

  ngOnDestroy() {
    
  }

  spin(raffle: HTMLElement) {
    let count = 0;
    this.isSpinning = true;
    setTimeout(() => {
      raffle.classList.remove('new');
      raffle.classList.add('show');
    }, 50);
    // this.startSpin();
    raffle.addEventListener('animationiteration', () => {
      count += 1;
      if (count === 3) {
        raffle.classList.remove('show');
        raffle.classList.add('new');
        raffle.style.setProperty('--transformEnd', '490deg');
        raffle.style.animationPlayState = 'running';
      }
      return;
    });
    // raffle.style.animationPlayState = 'paused';
  }

  fetchSpinItems() {
    this.loadingDetails = true;
    
    this.fetchSubscription = this.service.fetchSpinItems().subscribe((data: any) => {
      
      this.loadingDetails = false;
      if (data.status === 'success') {
        this.spinData = data;
        this.entries = data.product;
      }
    }, (error: any) => {
      
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
    });
  }

  resetSpinner(raffle: HTMLElement) {
    raffle.style.setProperty('--transformEnd', '0deg');
    this.isSpinning = false;
    this.showExtraBtns = false;
    this.retryData = null;
    // this.selectedEntry = null;
  }

  reset() {
    // this.selectedEntry = null;
    // this.resetSpinner(raffle)
    window.location.reload();
  }

  refreshWallet() {
    this.auth.getWalletBalance().subscribe((data: loggedInUser) => {
      this.auth.storeUser(data.user);
    }, (error: any) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
        } else {
          this.toastr.error('Server error. Please try again later', 'Error');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Server timed out. Please try again later', 'Time Out!');
      } else {
        this.toastr.error('An unknown error has occured. Please try again later', 'Error');
      }
    });
  }
  
  startSpin(raffle: HTMLElement) {
    Swal.fire({
      html: `Spin to win <b>${this.selectedEntry.product_name}</b> for ${this.currency.transform(this.selectedEntry.stake_amount, '₦')}?`,
      icon: 'question',
      width: '35rem',
      showCancelButton: true,
      confirmButtonText: 'Yes, Spin!',
      cancelButtonText: 'No, Thank You'
    }).then((result) => {
      if (result.value) {
        console.log(this.selectedEntry);
        let count = 0;
        this.isSpinning = true;
        setTimeout(() => {
          raffle.classList.remove('new');
          raffle.classList.add('show');
        }, 50);
        const spinDetails = {
          product_id: this.selectedEntry.product_id,
        };
        this.spinSubscription = this.service.startSpinSession(spinDetails).pipe().subscribe((data: any) => {
          this.retryData = data;
          raffle.addEventListener('animationiteration', () => {
            count += 1;
            if (this.retryData.status === 'success') {
              if (count > 1) {
                raffle.classList.remove('show');
                raffle.classList.add('new');
                if (this.retryData.spin_status === 0) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '280deg');
                } else if (this.retryData.spin_status === 1) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '240deg');
                } else if (this.retryData.spin_status === 2) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '40deg');
                } else if (this.retryData.spin_status === 3) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '160deg');
                } else if (this.retryData.spin_status === 4) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '120deg');
                } else if (this.retryData.spin_status === 10) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '200deg');
                } else if (this.retryData.spin_status === 5) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '80deg');
                } else if (this.retryData.spin_status === 7) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '320deg');
                }
                raffle.style.animationPlayState = 'running';
              }
              return;
            } else {
              this.errorMessage = true;
              raffle.classList.remove('show');
              this.showExtraBtns = true;
              this.isSpinning = false;
              this.toastr.error(data.message);
            }
          });
          raffle.addEventListener('animationend', () => {
            this.showExtraBtns = true;
            this.isSpinning = false;
            if (this.retryData.spin_status === 4) {
              // this.showRetryBtn = true;
              const message = 'You have won an extra spin!';
              this.showSuccessSwal(message);
            } else if (this.retryData.spin_status === 1) {
              const message = 'You have won!, Please check your mail';
              this.showSuccessSwal(message);
            } else if (this.retryData.spin_status === 2) {
              const message = 'You have won 20% winnings, Check your wininning balance';
              this.showSuccessSwal(message);
            } else if (this.retryData.spin_status === 3) {
              const message = 'You have won 10% winnings, Check your wallet';
              this.showSuccessSwal(message);
            } else {
              this.showLossSwal();
            }
            return this.retryData = null;
          });
          this.refreshWallet();
        }, (error: any) => {
          this.errorMessage = true;
          raffle.classList.remove('show');
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

  selectMobile(ev, raffle) {
    this.resetSpinner(raffle);
  }
  selectItem(even, raffle) {
    this.resetSpinner(raffle);
  }

  retrySpin(raffle: HTMLElement) {
    Swal.fire({
      html: `Spin again to win <b>${this.selectedEntry.product_name}</b> for
       ${this.currency.transform(this.selectedEntry.stake_amount, '₦')}?`,
      icon: 'question',
      width: '35rem',
      showCancelButton: true,
      confirmButtonText: 'Yes, Spin Again!',
      cancelButtonText: 'No, Thank You'
    }).then(result => {
      if (result.value) {
        let count = 0;
        this.isSpinning = true;
        raffle.style.setProperty('--transformEnd', '0deg');
        setTimeout(() => {
          raffle.classList.remove('new');
          raffle.classList.add('show');
        }, 50);
        this.spinSubscription = this.service.retrySpinSession().subscribe((data: any) => {
          this.retryData = data;
          raffle.addEventListener('animationiteration', () => {
            count += 1;
            if (this.retryData.status === 'success') {
              if (count > 1) {
                raffle.classList.remove('show');
                raffle.classList.add('new');
                if (this.retryData.spin_status === 0) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '280deg');
                } else if (this.retryData.spin_status === 1) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '240deg');
                } else if (this.retryData.spin_status === 2) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '40deg');
                } else if (this.retryData.spin_status === 3) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '160deg');
                } else if (this.retryData.spin_status === 4) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '120deg');
                } else if (this.retryData.spin_status === 10) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '200deg');
                } else if (this.retryData.spin_status === 5) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '80deg');
                } else if (this.retryData.spin_status === 7) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '320deg');
                }
                raffle.style.animationPlayState = 'running';
              }
              return;
            } else {
              this.errorMessage = true;
              raffle.classList.remove('show');
              
              this.showExtraBtns = true;
              this.isSpinning = false;
              this.toastr.error(data.message);
            }
          });
          raffle.addEventListener('animationend', () => {
            this.showExtraBtns = true;
            this.isSpinning = false;
            if (this.retryData.spin_status === 4) {
              this.showRetryBtn = true;
            } else if (this.retryData.spin_status === 1) {
              const message = 'You have won!, Please check your mail';
              this.showSuccessSwal(message);
            } else if (this.retryData.spin_status === 2) {
              const message = 'You have won 20% winnings, Check your wininning balance';
              this.showSuccessSwal(message);
            } else if (this.retryData.spin_status === 3) {
              const message = 'You have won 10% winnings, Check your wallet';
              this.showSuccessSwal(message);
            } else {
              this.showLossSwal();
            }
            return this.retryData = null;
          });
          this.refreshWallet();
        }, (error: any) => {
          this.errorMessage = true;
          raffle.classList.remove('show');
          
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

  showSuccessSwal(message) {
    return Swal.fire({
      title: 'Congratulations!',
      text: `${message}`,
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
      timer: 2500
    });
  }
}
