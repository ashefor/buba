import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { TimeoutError } from 'rxjs';
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
  @Output() makeBidEmitter = new EventEmitter();
  itemAmount = 2500;
  processing: boolean;

  constructor(private loadingBar: LoadingBarService, private bidService: BidService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    console.log('leaving');
    this.loadingBar.stop();
  }

  makeBid() {
    this.loadingBar.start();
    const {bid_id, bid_type, no_of_bid} = this.bidDetails;
    const bidData = {bid_id, bid_type, no_of_bid};
    console.log(bidData);
    this.processing = true;
    this.bidService.buyBid(bidData).subscribe((data: any) => {
      this.loadingBar.stop();
      this.processing = false;
      console.log(data);
      if (data.status === 'success') {
        this.bidService.setCurrentPage(5);
      } else {
        this.toastr.error(data.message, 'Error!');
      }
    } , (error: any) => {
      this.loadingBar.stop();
      this.processing = false;
      console.log(error);
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
    })
  }
}
