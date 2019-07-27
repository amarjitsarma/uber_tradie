import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuotelistPage } from './quotelist';

@NgModule({
  declarations: [
    QuotelistPage,
  ],
  imports: [
    IonicPageModule.forChild(QuotelistPage),
  ],
})
export class QuotelistPageModule {}
