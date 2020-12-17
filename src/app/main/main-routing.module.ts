import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { MainComponent } from './main.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'funding',
        loadChildren: () => import('../funding/funding.module').then(m => m.FundingModule)
      },
      {
        path: 'bids',
        loadChildren: () => import('../bids/bids.module').then(m => m.BidsModule)
      },
      {
        path: 'bid/status',
        loadChildren: () => import('../bids/bid-status/bid-status.module').then(m => m.BidStatusModule)
      },
      {
        path: 'withdrawals',
        loadChildren: () => import('../withdrawal/withdrawal.module').then(m => m.WithdrawalModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
