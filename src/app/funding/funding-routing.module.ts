import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundingComponent } from './funding.component';


const routes: Routes = [
  {
    path: '',
    component: FundingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundingRoutingModule { }
