import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailySpecialComponent } from './daily-special/daily-special.component';
import { GamesComponent } from './games.component';
import { QuickPlayComponent } from './quick-play/quick-play.component';
import { StatusComponent } from './status/status.component';


const routes: Routes = [
   {
        path: '',
        redirectTo: 'quick-play'
      },
      {
        path: 'daily-special',
        component: DailySpecialComponent
      },
      {
        path:'quick-play',
        component: QuickPlayComponent
      },
      {
        path: 'status',
        component: StatusComponent
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
