import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
  },
  {
    path: 'payment-account',
    loadChildren: () => import('./auth/payment-account/payment-account.module').then(m => m.PaymentAccountModule)
  },
  {
    path: 'bank-details',
    loadChildren: () => import('./auth/bank-details/bank-details.module').then(m => m.BankDetailsModule)
  },
  {
    path: 'process_bid',
    loadChildren: () => import('./makebid/makebid.module').then(m => m.MakebidModule)
  },
  {
    path: '',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
