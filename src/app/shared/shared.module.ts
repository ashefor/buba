import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ProgressBarModule} from 'primeng/progressbar';
import {ToggleButtonModule} from 'primeng/togglebutton';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ToggleButtonModule,
    ProgressBarModule,
    InputNumberModule,
    InputTextModule
  ],
  exports: [
    ButtonModule,
    InputNumberModule,
    ProgressBarModule,
    ToggleButtonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule
  ]
})
export class SharedModule { }
