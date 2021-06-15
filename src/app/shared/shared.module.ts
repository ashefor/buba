import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { TooltipModule } from 'primeng/tooltip';
import { AddBankDetailsComponent } from './components/add-bank-details/add-bank-details.component';
import { StepperFiveComponent } from '../makebid/components/stepper-five/stepper-five.component';
import { StepperFourComponent } from '../makebid/components/stepper-four/stepper-four.component';
import { StepperOneComponent } from '../makebid/components/stepper-one/stepper-one.component';
import { StepperThreeComponent } from '../makebid/components/stepper-three/stepper-three.component';
import { StepperTwoComponent } from '../makebid/components/stepper-two/stepper-two.component';
import { WinningMarqueeComponent } from './components/winning-marquee/winning-marquee.component';
import { CarouselModule } from 'primeng/carousel';
import { TabViewModule } from 'primeng/tabview';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { StepperComponent } from './components/stepper/stepper.component';
import { FooterComponent } from './components/footer/footer.component';
import { AccordionModule } from 'primeng/accordion';
import { FundDepositComponent } from './components/fund-deposit/fund-deposit.component';
import {CheckboxModule} from 'primeng/checkbox';

@NgModule({
  declarations: [SidenavComponent, TopnavComponent, MobileSidenavComponent, CustomeDatePipe, AddBankDetailsComponent,
    StepperOneComponent,
    StepperTwoComponent,
    StepperThreeComponent,
    StepperFourComponent,
    StepperFiveComponent,
    WinningMarqueeComponent,
    StepperComponent,
    FooterComponent,
    FundDepositComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    MessagesModule,
    ReactiveFormsModule,
    MenuModule,
    FormsModule,
    TableModule,
    AccordionModule,
    TabViewModule,
    TooltipModule,
    ToggleButtonModule,
    DropdownModule,
    ProgressBarModule,
    DialogModule,
    PanelMenuModule,
    InputNumberModule,
    KeyFilterModule,
    ToolbarModule,
    SplitButtonModule,
    CarouselModule,
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
    WinningMarqueeComponent,
    FundDepositComponent,
    ButtonModule,
    TabViewModule,
    AccordionModule,
    InputNumberModule,
    ProgressBarModule,
    ToggleButtonModule,
    ReactiveFormsModule,
    DropdownModule,
    ToolbarModule,
    SplitButtonModule,
    TooltipModule,
    MessagesModule,
    CarouselModule,
    TableModule,
    FormsModule,
    PanelMenuModule,
    DialogModule,
    TopnavComponent,
    KeyFilterModule,
    SidenavComponent,
    CustomeDatePipe,
    MobileSidenavComponent,
    InputTextModule,
    SidebarModule,
    StepperComponent,
    AddBankDetailsComponent,
    FooterComponent,
    CheckboxModule,
    RouterModule
  ],
  providers: [
    CurrencyPipe
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SharedModule { }
