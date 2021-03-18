import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResponsibleGamingComponent } from './responsible-gaming.component';


const routes: Routes = [
  {
    path: '',
    component: ResponsibleGamingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsibleGamingRoutingModule { }
