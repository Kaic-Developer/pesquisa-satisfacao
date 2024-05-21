import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Question5PageRoutingModule } from './question5-routing.module';

import { Question5Page } from './question5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Question5PageRoutingModule
  ],
  declarations: [Question5Page]
})
export class Question5PageModule {}
