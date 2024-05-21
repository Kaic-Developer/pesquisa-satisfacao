import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThankYouPage } from './thank-you.page';

const routes: Routes = [
  {
    path: '',
    component: ThankYouPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThankYouPageRoutingModule {}
