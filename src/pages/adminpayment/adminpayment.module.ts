import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminpaymentPage } from './adminpayment';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    AdminpaymentPage,
  ],
  imports: [
	IonicSelectableModule,
    IonicPageModule.forChild(AdminpaymentPage),
  ],
})
export class AdminpaymentPageModule {}
