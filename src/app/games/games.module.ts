import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { SharedModule } from '../shared/shared.module';
import { DailySpecialComponent } from './daily-special/daily-special.component';
import { QuickPlayComponent } from './quick-play/quick-play.component';
import { StatusComponent } from './status/status.component';
import { HistoryComponent } from './history/history.component';
import { RaffleDrawComponent } from './raffle-draw/raffle-draw.component';
import { SpinHistoryComponent } from './spin-history/spin-history.component';


@NgModule({
  declarations: [GamesComponent,
    DailySpecialComponent, QuickPlayComponent, StatusComponent, HistoryComponent, RaffleDrawComponent, SpinHistoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    GamesRoutingModule
  ],
  providers: [CurrencyPipe]
})
export class GamesModule { }
