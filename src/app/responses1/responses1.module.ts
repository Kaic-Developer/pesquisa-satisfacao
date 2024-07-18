import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Responses1PageRoutingModule } from './responses1-routing.module';

import { Responses1Page } from './responses1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Responses1PageRoutingModule
  ],
  declarations: [Responses1Page]
})
export class Responses1PageModule {}
