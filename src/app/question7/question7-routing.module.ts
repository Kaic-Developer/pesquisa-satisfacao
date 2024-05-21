import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Question7Page } from './question7.page';

const routes: Routes = [
  {
    path: '',
    component: Question7Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Question7PageRoutingModule {}
