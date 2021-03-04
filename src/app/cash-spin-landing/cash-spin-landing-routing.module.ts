import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CashSpinLandingComponent } from './cash-spin-landing.component';


const routes: Routes = [
  {
    path: '',
    component: CashSpinLandingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashSpinLandingRoutingModule { }
