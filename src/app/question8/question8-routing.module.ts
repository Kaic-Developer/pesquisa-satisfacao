import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Question8Page } from './question8.page';

const routes: Routes = [
  {
    path: '',
    component: Question8Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Question8PageRoutingModule {}
