import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MakeWithdrawalComponent } from './components/make-withdrawal/make-withdrawal.component';
import { WithdrawalHistoryComponent } from './components/withdrawal-history/withdrawal-history.component';
import { WithdrawalComponent } from './withdrawal.component';


const routes: Routes = [
  {
    path: '',
    component: WithdrawalComponent,
    children: [
      {
        path: '',
        redirectTo: 'history'
      },
      {
        path: 'new',
        component: MakeWithdrawalComponent
      },
      {
        path: 'history',
        component: WithdrawalHistoryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WithdrawalRoutingModule { }
