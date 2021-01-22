import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentAccountComponent } from './payment-account.component';


const routes: Routes = [
  {
    path: '',
    component: PaymentAccountComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentAccountRoutingModule { }
