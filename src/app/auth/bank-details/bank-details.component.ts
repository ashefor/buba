import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, TimeoutError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { RouterService } from 'src/app/core/services/router.service';
import { BidService } from 'src/app/makebid/services/bid.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {
  loading: boolean;
  returnUrl: any;
  addBankAccountForm: FormGroup;
  addBankAccountSubscription = new Subscription();
  constructor(private auth: AuthService, private bidService: BidService, private router: Router, private title: Title, private loadingBar: LoadingBarService, private toastr: ToastrService, private routerService: RouterService) { }

  ngOnInit(): void {
    this.returnUrl = this.routerService.getPreviousUrl();
  }

  addBankAccountHandler(formvalue) {
    this.loading = true;
    this.loadingBar.start();
    this.auth.addBankAccountDetails(formvalue).subscribe((bankData: any) => {
      this.loadingBar.stop();
      this.loading = false;
      if (bankData.status === 'success') {
        this.toastr.success('Success', bankData.message);
        this.addBankAccountForm.reset();
        if (this.auth.redirectUrl) {
          this.router.navigateByUrl(this.auth.redirectUrl);
        } else if (this.routerService.getRouteStatus() === 1) {
          if (this.returnUrl && this.returnUrl.length) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
      } else {
        this.toastr.error('Error!', bankData.message);
      }
    }, (error: any) => {
      this.loading = false;
      this.loadingBar.stop();
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          const badRequestError = error.error.message;
          this.addBankAccountForm.setErrors({
            badRequest: badRequestError
          });
        } else {
          this.toastr.error(error.error ? error.error.message : 'An error has occured. Please try again later');
        }
      } else if (error instanceof TimeoutError) {
        this.toastr.error('Server timeout. Please try again later');
      }
    });
  }
}
