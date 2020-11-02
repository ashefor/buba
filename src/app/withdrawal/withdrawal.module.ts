import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WithdrawalRoutingModule } from './withdrawal-routing.module';
import { WithdrawalComponent } from './withdrawal.component';
import { SharedModule } from '../shared/shared.module';
import { MakeWithdrawalComponent } from './components/make-withdrawal/make-withdrawal.component';
import { WithdrawalHistoryComponent } from './components/withdrawal-history/withdrawal-history.component';


@NgModule({
  declarations: [WithdrawalComponent, MakeWithdrawalComponent, WithdrawalHistoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    WithdrawalRoutingModule
  ]
})
export class WithdrawalModule { }
