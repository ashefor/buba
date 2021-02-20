import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BidStatusComponent } from './bid-status/bid-status.component';
import { BidsComponent } from './bids.component';


const routes: Routes = [
  {
    path: '',
    component: BidsComponent,
    children: [
      {
        path: 'status',
        loadChildren: () => import('../bids/bid-status/bid-status.module').then(m => m.BidStatusModule)
      },
      {
        path: 'open',
        loadChildren: () => import('../bids/open-bids/open-bids.module').then(m => m.OpenBidsModule)
      }, 
      {
        path: 'history',
        loadChildren: () => import('../bids/bid-history/bid-history.module').then(m => m.BidHistoryModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'open'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BidsRoutingModule { }
