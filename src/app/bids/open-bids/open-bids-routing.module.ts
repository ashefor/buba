import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpenBidsComponent } from './open-bids.component';


const routes: Routes = [
  {
    path: '',
    component: OpenBidsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenBidsRoutingModule { }
