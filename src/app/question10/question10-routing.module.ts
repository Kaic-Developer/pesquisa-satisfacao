import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Question10Page } from './question10.page';

const routes: Routes = [
  {
    path: '',
    component: Question10Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Question10PageRoutingModule {}
