import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, TimeoutError } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { bidDetails } from '../../models/bid-details';
import { BidService } from '../../services/bid.service';

@Component({
  selector: 'app-stepper-four',
  templateUrl: './stepper-four.component.html',
  styleUrls: ['./stepper-four.component.scss']
})
export class StepperFourComponent implements OnInit, OnDestroy {
  @Input() animation: any;
  @Input() bidDetails: bidDetails;
  @Input() accountDetails;
  @Output() stepFourEmitter = new EventEmitter();
  itemAmount = 2500;
  processing: boolean;
  makeBidSubscription: Subscription;
  constructor(private loadingBar: LoadingBarService,
              private auth: AuthService, private bidService: BidService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // this.makeBidSubscription.unsubscribe();
    this.loadingBar.stop();
  }

  makeBid() {
    this.loadingBar.start();
    const { bid_id, bid_type, no_of_bid } = this.bidDetails;
    const bidData = { bid_id, bid_type, no_of_bid };
    // console.log(bidData);
    this.processing = true;
    this.makeBidSubscription = this.bidService.buyBid(bidData).pipe(tap((bid) => {
      // console.log(bid);
   }), concatMap(() => this.auth.getWalletBalance())).subscribe((data: any) => {
      this.loadingBar.stop();
      this.processing = false;
      // console.log(data);
      this.auth.storeUser(data.user);
      if (data.status === 'success') {
        this.bidService.setCurrentPage(5);
      } else {
        this.toastr.error(data.message, 'Error!');
      }
    }, (error: any) => {
      this.loadingBar.stop();
      this.processing = false;
      // console.log(error);
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
}
