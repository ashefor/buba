import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LuckyjakaAdvertRoutingModule } from './luckyjaka-advert-routing.module';
import { LuckyjakaAdvertComponent } from './luckyjaka-advert.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [LuckyjakaAdvertComponent],
  imports: [
    CommonModule,
    SharedModule,
    LuckyjakaAdvertRoutingModule
  ]
})
export class LuckyjakaAdvertModule { }
