import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { LuckyjakaRoutingModule } from './luckyjaka-routing.module';
import { LuckyjakaComponent } from './luckyjaka.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [LuckyjakaComponent],
  imports: [
    CommonModule,
    SharedModule,
    LuckyjakaRoutingModule
  ],
  providers: [CurrencyPipe]
})
export class LuckyjakaModule { }
