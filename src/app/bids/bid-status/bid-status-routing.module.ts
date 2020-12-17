import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BidStatusComponent } from './bid-status.component';


const routes: Routes = [
  {
    path: '',
    component: BidStatusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BidStatusRoutingModule { }
