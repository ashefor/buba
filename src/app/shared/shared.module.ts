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



@NgModule({
  declarations: [SidenavComponent, TopnavComponent, MobileSidenavComponent, CustomeDatePipe],
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
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
    ButtonModule,
    InputNumberModule,
    ProgressBarModule,
    ToggleButtonModule,
    ReactiveFormsModule,
    DropdownModule,
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
    RouterModule
  ]
})
export class SharedModule { }
