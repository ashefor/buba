import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashSpinLandingRoutingModule } from './cash-spin-landing-routing.module';
import { CashSpinLandingComponent } from './cash-spin-landing.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [CashSpinLandingComponent],
  imports: [
    CommonModule,
    SharedModule,
    CashSpinLandingRoutingModule
  ]
})
export class CashSpinLandingModule { }
