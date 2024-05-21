import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Question5Page } from './question5.page';

const routes: Routes = [
  {
    path: '',
    component: Question5Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Question5PageRoutingModule {}
