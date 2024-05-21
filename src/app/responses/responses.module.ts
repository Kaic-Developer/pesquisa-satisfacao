import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ResponsesPageRoutingModule } from './responses-routing.module';

import { ResponsesPage } from './responses.page';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResponsesPageRoutingModule,
    NgxEchartsModule.forRoot({ echarts: () => import('echarts') })
  ],
  declarations: [ResponsesPage]
})
export class ResponsesPageModule {}
