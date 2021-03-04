import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CashWheelComponent } from './cash-wheel/cash-wheel.component';
import { DailySpecialComponent } from './daily-special/daily-special.component';
import { GamesComponent } from './games.component';
import { HistoryComponent } from './history/history.component';
import { QuickPlayComponent } from './quick-play/quick-play.component';
import { RaffleDrawComponent } from './raffle-draw/raffle-draw.component';
import { SpinHistoryComponent } from './spin-history/spin-history.component';
import { StatusComponent } from './status/status.component';


const routes: Routes = [
      {
        path: 'daily-special',
        component: DailySpecialComponent
      },
      {
        path: 'quick-play',
        component: QuickPlayComponent
      },
      {
        path: 'status',
        component: StatusComponent
      },
      {
        path: 'history',
        component: HistoryComponent
      },
      {
        path: 'wheel',
        component: RaffleDrawComponent
      },
      {
        path: 'berekete',
        component: CashWheelComponent
      },
      // {
      //   path: 'spin-history',
      //   component: SpinHistoryComponent
      // },
      {
        path: '',
        pathMatch: '',
        redirectTo: 'quick-play'
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
