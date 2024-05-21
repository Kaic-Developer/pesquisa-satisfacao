import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Question13Page } from './question13.page';

const routes: Routes = [
  {
    path: '',
    component: Question13Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Question13PageRoutingModule {}
