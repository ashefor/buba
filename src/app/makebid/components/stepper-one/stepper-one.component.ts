import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-stepper-one',
  templateUrl: './stepper-one.component.html',
  styleUrls: ['./stepper-one.component.scss']
})
export class StepperOneComponent implements OnInit, OnDestroy {
  @Input() bidList: any;
  @Input() bidInfo: any;
  @Input() animation: any;
  totalAmount = 0;
  quantity = 1;
  onIcon = 'pi pi-check';
  offIcon = 'pi pi pi-times';
  bidType1 = true;
  bidType2 = false;
  itemAmount = 2500;

  @Output() makeBidEmitter = new EventEmitter();
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    console.log('leaving');
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

  makeBid() {
    this.makeBidEmitter.emit(2);
  }

  changeQty(event) {
    if (event && event.value) {
      this.quantity = event.value;
    } else {
      this.quantity = 1;
    }
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
}
