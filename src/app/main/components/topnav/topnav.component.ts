import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, TimeoutError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { loggedInUser } from 'src/app/makebid/models/logged-user';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
  @Input() userDetails$: Observable<any>;
  processing: boolean;
  constructor(private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }


  refreshWallet() {
    this.processing = true;
    this.authService.getWalletBalance().subscribe((data: loggedInUser) => {
      this.processing = false;
      console.log(data);
      this.authService.storeUser(data.user);
    }, (error: any) => {
      this.processing = false;
      console.log(error);
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
}
