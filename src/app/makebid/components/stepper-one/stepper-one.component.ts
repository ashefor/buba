import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { TimeoutError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { bidDetails } from '../../models/bid-details';
import { loggedInUser } from '../../models/logged-user';
import { BidService } from '../../services/bid.service';

@Component({
  selector: 'app-stepper-one',
  templateUrl: './stepper-one.component.html',
  styleUrls: ['./stepper-one.component.scss']
})
export class StepperOneComponent implements OnInit, OnDestroy {
  @Input() error: any;
  @Input() bidList: any;
  @Input() bidInfo: any;
  @Input() animation: any;
  processing: boolean;
  totalAmount: number = null;
  quantity = 1;
  onIcon = 'pi pi-check';
  offIcon = 'pi pi pi-times';
  bidType1 = true;
  bidType2 = false;
  showMore: boolean;

  @Output() makeBidEmitter = new EventEmitter();
  // tslint:disable-next-line: max-line-length
  constructor(private authService: AuthService, private loadingBar: LoadingBarService, private bidService: BidService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.loadingBar.stop();
  }

  showMoreModal() {
    this.showMore = true;
  }
  handleBidTypeChange(type, e) {
    if (type === 1) {
      if (e.checked) {
        this.bidType1 = e.checked;
        this.bidType2 = false;
      } else {
        this.bidType1 = false;
        this.bidType2 = true;
      }
    } else {
      if (e.checked) {
        this.bidType2 = e.checked;
        this.bidType1 = false;
      } else {
        this.bidType2 = false;
        this.bidType1 = true;
      }
    }
  }

  // handleChange2(e) {
  //   if (e.checked) {
  //     this.bidType1 = e.checked;
  //     this.bidType2 = false;
  //   }
  // }

  // makeBid() {
  //   this.makeBidEmitter.emit(2);
  // }

  changeQty(event) {
    if (event && event.value) {
      this.quantity = event.value;
    } else {
      this.quantity = 1;
    }
    this.totalAmount = parseFloat(this.bidInfo.bid_details.price) * this.quantity;
  }

  // increaseQty() {
  //   this.quantity++;
  // }

  // decreaseQty() {
  //   if (this.quantity > 1) {
  //     this.quantity--;
  //   } else {
  //     return;
  //   }
  // }

  getBidProgressValue() {
    if (this.bidType1) {
      return ((this.bidInfo.bids_lucky_five / this.bidInfo.bid_list.total_bid_lucky_five) * 100);
    } else {
      return ((this.bidInfo.bids_lucky_one / this.bidInfo.bid_list.total_bid_lucky_one) * 100);
    }
  }

  makeBid() {
    this.loadingBar.start();
    this.processing = true;
    const bid: bidDetails = {
      bid_id: this.bidInfo.bid_details.bid_id,
      no_of_bid: this.quantity.toString(),
      // bid_type: this.bidType1 ? '1' : '2',
      bid_type: '5',
      // tslint:disable-next-line: max-line-length
      total_amount: this.totalAmount ? this.totalAmount.toString() : (parseFloat(this.bidInfo.bid_details.price) * this.quantity).toString(),
      bid_price: this.bidInfo.bid_details.price,
      product_name: this.bidInfo.bid_list.product_name,
      product_image: this.bidInfo.bid_list.product_image
    };
    // // console.log(bid);
    this.bidService.setBidDetails(bid);
    this.authService.getWalletBalance().subscribe((data: loggedInUser) => {
      this.loadingBar.stop();
      this.processing = false;
      // // console.log(data);
      this.bidService.setWalletDetails(data.user);
      bid.wallet_balance = data.user.balance;
      this.bidService.setBidDetails(bid);
      if (parseFloat(data.user.balance) < parseFloat(bid.total_amount)) {
        this.bidService.setCurrentPage(3);
      } else {
        this.bidService.setCurrentPage(4);
      }
    }, (error: any) => {
      this.loadingBar.stop();
      this.processing = false;
      // // console.log(error);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // this.bidService.setCurrentPage(2);
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

  get chanceOfWinning() {
    const percentage = ((this.quantity / this.bidInfo.bid_list.total_bid_lucky_five) * 100);
    return percentage.toFixed(1);
  }
}
