import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BidStatusComponent } from './bid-status/bid-status.component';
import { BidsComponent } from './bids.component';


const routes: Routes = [
  {
    path: '',
    component: BidsComponent
  },
  {
    path: 'status',
    component: BidStatusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BidsRoutingModule { }
