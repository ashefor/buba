import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthService } from '../core/services/auth.service';
import { BidService } from './services/bid.service';

@Component({
  selector: 'app-makebid',
  templateUrl: './makebid.component.html',
  styleUrls: ['./makebid.component.scss']
})
export class MakebidComponent implements OnInit {
  currentPage = 1;
  bidId: string;
  bidList: any;
  bidDetails: any;
  bidInfo: any;
  state: false;
  animation = 'animate__slideInRight';
  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute, private service: BidService, private loadingBar: LoadingBarService, private auth: AuthService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      console.log(params.id);
      this.fetchOneBid(params.id);
    });
  }

  changePage() {
    this.currentPage += 1;
  }



  goToNextPage(event) {
    console.log(event);
    this.animation = 'animate__slideInRight';
    if (this.currentPage === 1) {
      if (this.auth.isLoggedIn()) {
        return this.currentPage = 3;
      } else {
        return this.currentPage += 1;
      }
    } else {
      return this.currentPage += 1;
    }
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
    }, error => {
      this.loadingBar.stop();
      console.log(error);
    });
  }

  goBack() {
    this.animation = 'animate__slideInLeft';
    return this.currentPage -= 1;
  }
}
