import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { TimeoutError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { bidDetails } from '../../models/bid-details';
import { loggedInUser } from '../../models/logged-user';
import { BidService } from '../../services/bid.service';

@Component({
  selector: 'app-stepper-three',
  templateUrl: './stepper-three.component.html',
  styleUrls: ['./stepper-three.component.scss']
})
export class StepperThreeComponent implements OnInit, OnDestroy {
  @Output() authenticateEmitter = new EventEmitter();
  @Input() animation: any;
  @Input() bidDetails: bidDetails;
  @Input() accountDetails: any;
  processing: boolean;
  constructor(private loadingBar: LoadingBarService, private bidService: BidService, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    console.log('leaving');
    this.loadingBar.stop();
  }

  authenticate() {
    this.loadingBar.start();
    this.processing = true;
    this.authService.getWalletBalance().subscribe((data: loggedInUser) => {
      this.loadingBar.stop();
      this.processing = false;
      console.log(data);
      this.bidService.setWalletDetails(data.user);
      if (parseFloat(data.user.balance) > parseFloat(this.bidDetails.total_amount)) {
        this.bidService.setCurrentPage(4);
      } else {
        this.toastr.info('Payment has not reflected yet. Please hold on');
      }
    }, (error: any) => {
      this.loadingBar.stop();
      this.processing = false;
      console.log(error);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          this.bidService.setCurrentPage(2);
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
}
