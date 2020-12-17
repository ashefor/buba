import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BidStatusRoutingModule } from './bid-status-routing.module';
import { BidStatusComponent } from './bid-status.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [BidStatusComponent],
  imports: [
    CommonModule,
    SharedModule,
    BidStatusRoutingModule
  ]
})
export class BidStatusModule { }
