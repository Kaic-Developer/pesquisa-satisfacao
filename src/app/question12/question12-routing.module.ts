import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Question12Page } from './question12.page';

const routes: Routes = [
  {
    path: '',
    component: Question12Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Question12PageRoutingModule {}
