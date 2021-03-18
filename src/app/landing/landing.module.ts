import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { SharedModule } from '../shared/shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    SlickCarouselModule,
    LazyLoadImageModule,
    SharedModule,
    LandingRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class LandingModule { }
