import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenBidsRoutingModule } from './open-bids-routing.module';
import { OpenBidsComponent } from './open-bids.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [OpenBidsComponent],
  imports: [
    CommonModule,
    SharedModule,
    OpenBidsRoutingModule
  ]
})
export class OpenBidsModule { }
