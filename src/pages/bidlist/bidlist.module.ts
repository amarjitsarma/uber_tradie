import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BidlistPage } from './bidlist';

@NgModule({
  declarations: [
    BidlistPage,
  ],
  imports: [
    IonicPageModule.forChild(BidlistPage),
  ],
})
export class BidlistPageModule {}
