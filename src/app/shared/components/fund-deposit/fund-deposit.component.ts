import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BidService } from 'src/app/makebid/services/bid.service';

@Component({
  selector: 'app-fund-deposit',
  templateUrl: './fund-deposit.component.html',
  styleUrls: ['./fund-deposit.component.scss']
})
export class FundDepositComponent implements OnInit {
  fundWalletForm: FormGroup;
  isPaying: boolean;

  constructor( private fb: FormBuilder,
    private bidService: BidService,private router: Router) { }

  ngOnInit(): void {
    this.fundWalletFormInit();
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
