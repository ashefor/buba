import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LuckyjakaRoutingModule } from './luckyjaka-routing.module';
import { LuckyjakaComponent } from './luckyjaka.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [LuckyjakaComponent],
  imports: [
    CommonModule,
    SharedModule,
    LuckyjakaRoutingModule
  ]
})
export class LuckyjakaModule { }
