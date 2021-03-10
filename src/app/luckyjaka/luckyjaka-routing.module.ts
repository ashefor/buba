import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LuckyjakaComponent } from './luckyjaka.component';

const routes: Routes = [
  {
    path: '',
    component: LuckyjakaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LuckyjakaRoutingModule { }
