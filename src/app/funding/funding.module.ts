import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FundingRoutingModule } from './funding-routing.module';
import { FundingComponent } from './funding.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [FundingComponent],
  imports: [
    CommonModule,
    SharedModule,
    FundingRoutingModule
  ]
})
export class FundingModule { }
