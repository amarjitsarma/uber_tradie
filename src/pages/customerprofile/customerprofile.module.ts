import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerprofilePage } from './customerprofile';

@NgModule({
  declarations: [
    CustomerprofilePage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerprofilePage),
  ],
})
export class CustomerprofilePageModule {}
