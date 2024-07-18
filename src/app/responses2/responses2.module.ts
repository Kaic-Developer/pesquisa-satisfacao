import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Responses2PageRoutingModule } from './responses2-routing.module';

import { Responses2Page } from './responses2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Responses2PageRoutingModule
  ],
  declarations: [Responses2Page]
})
export class Responses2PageModule {}
