import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Question9Page } from './question9.page';

const routes: Routes = [
  {
    path: '',
    component: Question9Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Question9PageRoutingModule {}
