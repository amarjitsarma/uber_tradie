import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BidformPage } from './bidform';
import { TooltipsModule } from 'ionic-tooltips';
@NgModule({
  declarations: [
    BidformPage,
  ],
  imports: [
    IonicPageModule.forChild(BidformPage),
	TooltipsModule.forRoot(),
  ],
})
export class BidformPageModule {}
