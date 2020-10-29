import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, TimeoutError } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { BidService } from './services/bid.service';

@Component({
  selector: 'app-makebid',
  templateUrl: './makebid.component.html',
  styleUrls: ['./makebid.component.scss']
})
export class MakebidComponent implements OnInit {
  currentPage$: Observable<number>;
  bidDetails$: Observable<any>;
  accountDetails$: Observable<any>;
  fetchBidErrors: any;
  bidId: string;
  bidList: any;
  bidInfo: any;
  state: false;
  animation = 'animate__slideInRight';
  processing: boolean;
  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute, private service: BidService, private loadingBar: LoadingBarService, private auth: AuthService, private toastr: ToastrService, private chref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.currentPage$ = this.service.getCurrentPage$();
    this.bidDetails$ = this.service.getBidDetails$();
    this.accountDetails$ = this.service.getWalletDetails$();
    this.route.params.subscribe((params: Params) => {
      console.log(params.id);
      this.fetchOneBid(params.id);
    });
  }

  changePage() {
    // this.currentPage += 1;
  }

  handleGoback(page) {
    this.service.setCurrentPage(page);
  }

  goToNextPage(event) {
    console.log(event);
    this.animation = 'animate__slideInRight';
    this.service.setCurrentPage(3);
  }

  logUserIn(user) {
    // console.log(user);
    // this.loadingBar.start();
    // this.auth.login(user).subscribe((loggedUser: any) => {
    //   this.loadingBar.stop();
    //   console.log(loggedUser);
    // }, (error: any) => {
    //   this.loadingBar.stop();
    //   console.log(error);
    //   if(error instanceof HttpErrorResponse) {
    //     if(error.status === 400) {

    //     }
    //   }
    // })
  }
  fetchOneBid(bidId) {
    this.loadingBar.start();
    this.service.listOneBid(bidId).subscribe((data: any) => {
      this.loadingBar.stop();
      console.log(data);
      if (data.status === 'success') {
        this.bidInfo = data;
        this.bidList = data.bid_list;
      }
    }, (error: HttpErrorResponse) => {
      this.loadingBar.stop();
      console.log(error);
      if (error.status === 404) {
        this.fetchBidErrors = error.error.message;
      }
    });
  }

  // goBack() {
  //   this.animation = 'animate__slideInLeft';
  //   return this.currentPage -= 1;
  // }


}
