import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifyPaymentComponent } from './verify-payment.component';


const routes: Routes = [
  {
    path: '',
    component: VerifyPaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyPaymentRoutingModule { }
