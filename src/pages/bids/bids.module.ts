import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BidsPage } from './bids';

@NgModule({
  declarations: [
    BidsPage,
  ],
  imports: [
    IonicPageModule.forChild(BidsPage),
  ],
})
export class BidsPageModule {}
