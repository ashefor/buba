import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { MakebidRoutingModule } from './makebid-routing.module';
import { MakebidComponent } from './makebid.component';
// import { StepperOneComponent } from './components/stepper-one/stepper-one.component';
import { SharedModule } from '../shared/shared.module';
// import { StepperTwoComponent } from './components/stepper-two/stepper-two.component';
// import { StepperThreeComponent } from './components/stepper-three/stepper-three.component';
// import { StepperFourComponent } from './components/stepper-four/stepper-four.component';
// import { StepperFiveComponent } from './components/stepper-five/stepper-five.component';


@NgModule({
  declarations: [
    MakebidComponent,
    // StepperOneComponent,
    // StepperTwoComponent,
    // StepperThreeComponent,
    // StepperFourComponent,
    // StepperFiveComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MakebidRoutingModule
  ],
  providers: [
    CurrencyPipe
  ]
})
export class MakebidModule { }
