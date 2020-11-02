import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MakebidModule } from './makebid/makebid.module';


const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule)
  },
  // {
  //   path: 'register',
  //   loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule)
  // },
  {
    path: 'reset-password',
    loadChildren: () =>  import('./auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
  },
  {
    path: '',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  {
    path: 'process_bid',
    loadChildren: () => import('./makebid/makebid.module').then(m => m.MakebidModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
