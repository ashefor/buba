import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [GamesComponent],
  imports: [
    CommonModule,
    SharedModule,
    GamesRoutingModule
  ]
})
export class GamesModule { }
