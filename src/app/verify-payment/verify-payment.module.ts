import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyPaymentRoutingModule } from './verify-payment-routing.module';
import { VerifyPaymentComponent } from './verify-payment.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [VerifyPaymentComponent],
  imports: [
    CommonModule,
    SharedModule,
    VerifyPaymentRoutingModule
  ]
})
export class VerifyPaymentModule { }
