import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Responses1Page } from './responses1.page';

const routes: Routes = [
  {
    path: '',
    component: Responses1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Responses1PageRoutingModule {}
