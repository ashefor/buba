import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { MainComponent } from './main.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'settings',
        canActivate: [AuthGuard],
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'games',
        loadChildren: () => import('../games/games.module').then(m => m.GamesModule)
      },
      {
        path: 'funding',
        canActivate: [AuthGuard],
        loadChildren: () => import('../funding/funding.module').then(m => m.FundingModule)
      },
      {
        path: 'bids',
        canActivate: [AuthGuard],
        loadChildren: () => import('../bids/bids.module').then(m => m.BidsModule)
      },
      {
        path: 'withdrawals',
        canActivate: [AuthGuard],
        loadChildren: () => import('../withdrawal/withdrawal.module').then(m => m.WithdrawalModule)
      },
      {
        path: 'landing',
        loadChildren: () => import('../root/root.module').then(m => m.RootModule)
      },
      {
        path: 'fb-landing',
        loadChildren: () => import('../root/root.module').then(m => m.RootModule)
      },
      {
        path: 'twt-landing',
        loadChildren: () => import('../root/root.module').then(m => m.RootModule)
      },
      {
        path: 'yt-landing',
        loadChildren: () => import('../root/root.module').then(m => m.RootModule)
      },
      {
        path: 'berekete',
        loadChildren: () => import('../cash-spin-landing/cash-spin-landing.module').then(m => m.CashSpinLandingModule)
      },
      {
        path: 'deposit',
        canActivate: [AuthGuard],
        loadChildren: () => import('../transactions/transactions.module').then(m => m.TransactionsModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
