import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentAccountRoutingModule } from './payment-account-routing.module';
import { PaymentAccountComponent } from './payment-account.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [PaymentAccountComponent],
  imports: [
    CommonModule,
    SharedModule,
    PaymentAccountRoutingModule
  ]
})
export class PaymentAccountModule { }
