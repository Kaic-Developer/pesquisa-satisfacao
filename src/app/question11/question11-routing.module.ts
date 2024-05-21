import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Question11Page } from './question11.page';

const routes: Routes = [
  {
    path: '',
    component: Question11Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Question11PageRoutingModule {}
