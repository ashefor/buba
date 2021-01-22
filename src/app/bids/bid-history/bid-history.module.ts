import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BidHistoryRoutingModule } from './bid-history-routing.module';
import { BidHistoryComponent } from './bid-history.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [BidHistoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    BidHistoryRoutingModule
  ]
})
export class BidHistoryModule { }
