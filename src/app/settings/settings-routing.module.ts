import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankAccountComponent } from './components/bank-account/bank-account.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { IdCardComponent } from './components/id-card/id-card.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { SettingsComponent } from './settings.component';


const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile-edit'
      },
      {
        path: 'profile-edit',
        component: ProfileEditComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'id-card',
        component: IdCardComponent
      },
      {
        path: 'bank-account',
        component: BankAccountComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
