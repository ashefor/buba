import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BidsRoutingModule } from './bids-routing.module';
import { BidsComponent } from './bids.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [BidsComponent],
  imports: [
    CommonModule,
    SharedModule,
    BidsRoutingModule
  ]
})
export class BidsModule { }
