import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankDetailsComponent } from './bank-details.component';


const routes: Routes = [
  {
    path: '',
    component: BankDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankDetailsRoutingModule { }
