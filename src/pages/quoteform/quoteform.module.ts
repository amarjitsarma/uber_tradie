import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuoteformPage } from './quoteform';

@NgModule({
  declarations: [
    QuoteformPage,
  ],
  imports: [
    IonicPageModule.forChild(QuoteformPage),
  ],
})
export class QuoteformPageModule {}
