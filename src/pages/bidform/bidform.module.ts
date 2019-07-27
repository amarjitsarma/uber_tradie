import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BidformPage } from './bidform';

@NgModule({
  declarations: [
    BidformPage,
  ],
  imports: [
    IonicPageModule.forChild(BidformPage),
  ],
})
export class BidformPageModule {}
