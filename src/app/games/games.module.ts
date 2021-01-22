import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { SharedModule } from '../shared/shared.module';
import { DailySpecialComponent } from './daily-special/daily-special.component';
import { QuickPlayComponent } from './quick-play/quick-play.component';
import { StatusComponent } from './status/status.component';
import { HistoryComponent } from './history/history.component';


@NgModule({
  declarations: [GamesComponent, DailySpecialComponent, QuickPlayComponent, StatusComponent, HistoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    GamesRoutingModule
  ]
})
export class GamesModule { }
