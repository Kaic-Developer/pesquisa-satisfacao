import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'question1', loadChildren: () => import('./question1/question1.module').then(m => m.Question1PageModule) },
  { path: 'question2', loadChildren: () => import('./question2/question2.module').then(m => m.Question2PageModule) },
  { path: 'question3', loadChildren: () => import('./question3/question3.module').then(m => m.Question3PageModule) },
  { path: 'question4', loadChildren: () => import('./question4/question4.module').then(m => m.Question4PageModule) },
  { path: 'question5', loadChildren: () => import('./question5/question5.module').then(m => m.Question5PageModule) },
  { path: 'question6', loadChildren: () => import('./question6/question6.module').then(m => m.Question6PageModule) },
  { path: 'question7', loadChildren: () => import('./question7/question7.module').then(m => m.Question7PageModule) },
  { path: 'question8', loadChildren: () => import('./question8/question8.module').then(m => m.Question8PageModule) },
  { path: 'question9', loadChildren: () => import('./question9/question9.module').then(m => m.Question9PageModule) },
  { path: 'question10', loadChildren: () => import('./question10/question10.module').then(m => m.Question10PageModule) },
  { path: 'question11', loadChildren: () => import('./question11/question11.module').then(m => m.Question11PageModule) },
  { path: 'question12', loadChildren: () => import('./question12/question12.module').then(m => m.Question12PageModule) },
  { path: 'question13', loadChildren: () => import('./question13/question13.module').then(m => m.Question13PageModule) },
  { path: 'thank-you', loadChildren: () => import('./thank-you/thank-you.module').then(m => m.ThankYouPageModule) },
  { path: 'responses', loadChildren: () => import('./responses/responses.module').then(m => m.ResponsesPageModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
