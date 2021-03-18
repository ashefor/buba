import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponsibleGamingRoutingModule } from './responsible-gaming-routing.module';
import { ResponsibleGamingComponent } from './responsible-gaming.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ResponsibleGamingComponent],
  imports: [
    CommonModule,
    SharedModule,
    ResponsibleGamingRoutingModule
  ]
})
export class ResponsibleGamingModule { }
