import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { BidService } from '../makebid/services/bid.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  userDetails$: Observable<any>;
  displayFundModal: boolean;
  displayJollofModal: boolean;
  fundWalletForm: FormGroup;
  isPaying: boolean;

  constructor(private authService: AuthService, private title: Title, private fb: FormBuilder,
    private bidService: BidService, private router: Router) {
    this.title.setTitle('Buba - Account Deposit');
  }

  ngOnInit(): void {
    this.userDetails$ = this.authService.getUser$();
    this.fundWalletFormInit();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.displayJollofModal = true;
    }, 500);
  }

  openFundModal() {
    this.displayFundModal = true;
  }

  fundWalletFormInit() {
    this.fundWalletForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(100)]],
    });
  }

  get fundWalletFormControls() {
    return this.fundWalletForm.controls;
  }

  resetFundModal() {
    this.fundWalletForm.reset();
  }

  makePayment(formValue) {
    // this.userDetails$.subscribe(user => {
    //   // this.flutterwave.inlinePay(this.paymentData);
    // })
    Object.keys(this.fundWalletForm.controls).forEach(key => {
      this.fundWalletForm.controls[key].markAsDirty();
      this.fundWalletForm.controls[key].updateValueAndValidity();
    });
    if (this.fundWalletForm.invalid) {
      return;
    } else {
      const details = {
        amount: formValue.amount,
        return_url: this.router.url,
      };
      this.isPaying = true;
      this.fundWalletForm.disable();
      this.bidService.initiatePaystack(details).subscribe((data: any) => {
        if (data.status === 'success') {
          location.href = data.link;
        }
        this.isPaying = false;
      }, err => {
        this.isPaying = false;
        this.fundWalletForm.disable();
      });
    }
  }
}
