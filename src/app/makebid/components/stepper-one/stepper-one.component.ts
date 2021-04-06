import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
  styleUrls: ['./stepper-one.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
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
  howToModal: boolean;

  @Output() makeBidEmitter = new EventEmitter();
  maxError: boolean;
  // tslint:disable-next-line: max-line-length
  constructor(private authService: AuthService,  private bidService: BidService, private toastr: ToastrService, private chref: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    
  }

  showHowToModal() {
    this.howToModal = true;
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

  getTotalBidsAmount(percentage) {
    // const percent = (percentage /100)
    return (((percentage / 100) * this.bidInfo.bid_details.price) * this.bidInfo.bid_list.total_bid_lucky_five);
  }
  changeQty(event) {
    if (event && event.value) {
      this.quantity = event.value;
      if (this.quantity > this.bidInfo?.slot_left) {
        this.maxError = true;
      } else {
        this.maxError = false;
      }
    } else {
      this.quantity = 1;
      this.maxError = false;
    }
    this.totalAmount = parseFloat(this.bidInfo.bid_list.bid_prize) * this.quantity;
  }

 

  getBidProgressValue(start, end) {
    const endDate = new Date(end);
    const startDate = new Date(start);
    const nowDate = new Date(Date.now());
    const now = Math.abs(nowDate.getTime() - startDate.getTime()) / 3600000;
    const difference = Math.abs(endDate.getTime() - startDate.getTime()) / 3600000;

    return ((Math.abs(now) / Math.abs(difference)) * 100)
  }

  makeBid() {
    
    this.processing = true;
    const bid: bidDetails = {
      bid_id: this.bidInfo.bid_details.bid_id,
      no_of_bid: this.quantity.toString(),
      // bid_type: this.bidType1 ? '1' : '2',
      bid_type: '5',
      // tslint:disable-next-line: max-line-length
      total_amount: this.totalAmount ? this.totalAmount.toString() : (parseFloat(this.bidInfo.bid_list.bid_prize) * this.quantity).toString(),
      bid_price: this.bidInfo.bid_list.bid_prize,
      product_name: this.bidInfo.bid_list.product_name,
      product_image: this.bidInfo.bid_list.product_image
    };
    this.bidService.setBidDetails(bid);
    this.authService.getWalletBalance().subscribe((data: loggedInUser) => {
      
      this.processing = false;
      this.bidService.setWalletDetails(data.user);
      this.authService.storeUser(data.user);
      bid.wallet_balance = data.user.balance;
      this.bidService.setBidDetails(bid);
      if (parseFloat(data.user.balance) < parseFloat(bid.total_amount)) {
        this.bidService.setCurrentPage(3);
      } else {
        this.bidService.setCurrentPage(4);
      }
    }, (error: any) => {
      
      this.processing = false;
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // this.bidService.setCurrentPage(2);
        } else {
          this.toastr.error('An error has occured. Please try again later', 'Error');
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
