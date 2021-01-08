import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickPlayRoutingModule } from './quick-play-routing.module';
import { QuickPlayComponent } from './quick-play.component';


@NgModule({
  declarations: [QuickPlayComponent],
  imports: [
    CommonModule,
    QuickPlayRoutingModule
  ]
})
export class QuickPlayModule { }
