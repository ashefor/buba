import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankDetailsRoutingModule } from './bank-details-routing.module';
import { BankDetailsComponent } from './bank-details.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [BankDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    BankDetailsRoutingModule
  ]
})
export class BankDetailsModule { }
