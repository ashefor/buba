import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Subscription, TimeoutError } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { bidDetails } from '../../models/bid-details';
import { BidService } from '../../services/bid.service';
import Swal from 'sweetalert2';
import { GamesService } from 'src/app/games/services/games.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-stepper-four',
  templateUrl: './stepper-four.component.html',
  styleUrls: ['./stepper-four.component.scss']
})
export class StepperFourComponent implements OnInit, OnDestroy {
  @Input() animation: any;
  @Input() bidDetails: bidDetails;
  @Input() accountDetails;
  @Input() gameType: any;
  @Input() selectedEntry: any;
  @Output() stepFourEmitter = new EventEmitter();
  itemAmount = 2500;
  processing: boolean;
  makeBidSubscription: Subscription;
  retryData: any;
  isSpinning: boolean;
  errorMessage: boolean;
  showExtraBtns: boolean;
  showRetryBtn: boolean;
  constructor(private loadingBar: LoadingBarService,
              private auth: AuthService,
              private currency: CurrencyPipe,
              private service: GamesService,
              private bidService: BidService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.loadingBar.stop();
  }

  makeBid() {
    this.loadingBar.start();
    const { bid_id, bid_type, no_of_bid } = this.bidDetails;
    const bidData = { bid_id, bid_type, no_of_bid };
    this.processing = true;
    this.makeBidSubscription = this.bidService.buyBid(bidData).pipe(tap((bid) => {
   }), concatMap(() => this.auth.getWalletBalance())).subscribe((data: any) => {
      this.loadingBar.stop();
      this.processing = false;
      this.auth.storeUser(data.user);
      if (data.status === 'success') {
        this.bidService.setCurrentPage(5);
      } else {
        this.toastr.error(data.message, 'Error!');
      }
    }, (error: any) => {
      this.loadingBar.stop();
      this.processing = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          this.bidService.setCurrentPage(2);
        } else if (error.status === 400) {
          this.toastr.error(error.error.message, 'Error');
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

  goBack() {
    this.stepFourEmitter.emit(1);
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
        let count = 0;
        this.isSpinning = true;
        setTimeout(() => {
          raffle.classList.remove('new');
          raffle.classList.add('show');
        }, 50);
        const spinDetails = {
          product_id: this.selectedEntry.product_id,
        };
        this.loadingBar.start();
        this.service.startSpinSession(spinDetails).subscribe((data: any) => {
          this.loadingBar.stop();
          this.retryData = data;
          raffle.addEventListener('animationiteration', () => {
            count += 1;
            if (this.retryData.status === 'success') {
              if (count > 1) {
                raffle.classList.remove('show');
                raffle.classList.add('new');
                if (this.retryData.spin_status === 0) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '80deg');
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
                } else if (this.retryData.spin_status === 11) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '280deg');
                } else if (this.retryData.spin_status === 12) {
                  count = 0;
                  raffle.style.setProperty('--transformEnd', '320deg');
                }
                raffle.style.animationPlayState = 'running';
              }
              return;
            } else {
              this.errorMessage = true;
              raffle.classList.remove('show');
              this.loadingBar.stop();
              this.showExtraBtns = true;
              this.isSpinning = false;
              this.toastr.error(data.message);
            }
          });
          raffle.addEventListener('animationend', () => {
            this.showExtraBtns = true;
            this.isSpinning = false;
            if (this.retryData.spin_status === 4) {
              const message = 'You have won an extra spin!';
              this.showSuccessSwal(message);
            } else if (this.retryData.spin_status === 1) {
              const message = 'You have won!, Please check your mail';
              this.showSuccessSwal(message);
            } else if (this.retryData.spin_status === 2 ) {
              const message = 'You have won 20% winnings, Check your wininning balance';
              this.showSuccessSwal(message);
            } else if (this.retryData.spin_status === 3 ) {
              const message = 'You have won 10% winnings, Check your wallet';
              this.showSuccessSwal(message);
            } else {
              this.showLossSwal();
            }
            return this.retryData = null;
          });
        }, (error: any) => {
          this.errorMessage = true;
          raffle.classList.remove('show');
          this.loadingBar.stop();
          this.showExtraBtns = true;
          this.isSpinning = false;
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              return EMPTY;
            } else if (error.status === 400) {
              this.toastr.error(error.error.message);
              if (error.error.funding_tag === 0) {
                this.bidService.setCurrentPage(2);
              }
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
      timer: 2500
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
