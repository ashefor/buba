import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    SharedModule,
    FaqRoutingModule
  ]
})
export class FaqModule { }
