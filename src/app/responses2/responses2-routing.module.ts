import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Responses2Page } from './responses2.page';

const routes: Routes = [
  {
    path: '',
    component: Responses2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Responses2PageRoutingModule {}
