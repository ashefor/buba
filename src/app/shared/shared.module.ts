import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { TopnavComponent } from './components/topnav/topnav.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { MobileSidenavComponent } from './components/mobile-sidenav/mobile-sidenav.component';
import { DialogModule } from 'primeng/dialog';
import { CustomeDatePipe } from '../core/pipes/custome-date.pipe';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import {TooltipModule} from 'primeng/tooltip';
import { AddBankDetailsComponent } from './components/add-bank-details/add-bank-details.component';
import { StepperFiveComponent } from '../makebid/components/stepper-five/stepper-five.component';
import { StepperFourComponent } from '../makebid/components/stepper-four/stepper-four.component';
import { StepperOneComponent } from '../makebid/components/stepper-one/stepper-one.component';
import { StepperThreeComponent } from '../makebid/components/stepper-three/stepper-three.component';
import { StepperTwoComponent } from '../makebid/components/stepper-two/stepper-two.component';



@NgModule({
  declarations: [SidenavComponent, TopnavComponent, MobileSidenavComponent, CustomeDatePipe, AddBankDetailsComponent, 
    StepperOneComponent,
    StepperTwoComponent,
    StepperThreeComponent,
    StepperFourComponent,
    StepperFiveComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    MessagesModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    TooltipModule,
    ToggleButtonModule,
    DropdownModule,
    ProgressBarModule,
    DialogModule,
    InputNumberModule,
    KeyFilterModule,
    InputTextModule,
    SidebarModule,
    RouterModule
  ],
  exports: [
    StepperOneComponent,
    StepperTwoComponent,
    StepperThreeComponent,
    StepperFourComponent,
    StepperFiveComponent,
    ButtonModule,
    InputNumberModule,
    ProgressBarModule,
    ToggleButtonModule,
    ReactiveFormsModule,
    DropdownModule,
    TooltipModule,
    MessagesModule,
    TableModule,
    FormsModule,
    DialogModule,
    TopnavComponent,
    KeyFilterModule,
    SidenavComponent,
    CustomeDatePipe,
    MobileSidenavComponent,
    InputTextModule,
    SidebarModule,
    AddBankDetailsComponent,
    RouterModule
  ]
})
export class SharedModule { }
