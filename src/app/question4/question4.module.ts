import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Question4PageRoutingModule } from './question4-routing.module';

import { Question4Page } from './question4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Question4PageRoutingModule
  ],
  declarations: [Question4Page]
})
export class Question4PageModule {}
