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
  // {
  //   path: 'bank-details',
  //   loadChildren: () => import('./auth/bank-details/bank-details.module').then(m => m.BankDetailsModule)
  // },
  {
    path: 'process_bid',
    loadChildren: () => import('./makebid/makebid.module').then(m => m.MakebidModule)
  },
  {
    path: 'verify_payment',
    loadChildren: () => import('./verify-payment/verify-payment.module').then(m => m.VerifyPaymentModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  {
    path: 'faqs',
    loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule)
  },
  {
    path: 'responsible-gaming',
    loadChildren: () => import('./responsible-gaming/responsible-gaming.module').then(m => m.ResponsibleGamingModule)
  },
  {
    path: '',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule)
  },
  // {
  //   path: '',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full'
  // },
  {
    path: '**',
    loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
