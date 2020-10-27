import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { IdCardComponent } from './components/id-card/id-card.component';
import { BankAccountComponent } from './components/bank-account/bank-account.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [SettingsComponent, ProfileEditComponent, ChangePasswordComponent, IdCardComponent, BankAccountComponent],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
