import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Question4Page } from './question4.page';

const routes: Routes = [
  {
    path: '',
    component: Question4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Question4PageRoutingModule {}
