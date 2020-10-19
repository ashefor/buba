import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MakebidComponent } from './makebid.component';


const routes: Routes = [
  {
    path: 'bid',
    component: MakebidComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MakebidRoutingModule { }
