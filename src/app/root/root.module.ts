import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [RootComponent],
  imports: [
    CommonModule,
    SharedModule,
    RootRoutingModule
  ],
  providers: [CurrencyPipe]
})
export class RootModule { }
