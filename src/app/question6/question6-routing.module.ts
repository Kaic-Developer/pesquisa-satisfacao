import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Question6Page } from './question6.page';

const routes: Routes = [
  {
    path: '',
    component: Question6Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Question6PageRoutingModule {}
