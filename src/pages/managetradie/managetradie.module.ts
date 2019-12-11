import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagetradiePage } from './managetradie';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    ManagetradiePage,
  ],
  imports: [
	IonicSelectableModule,
    IonicPageModule.forChild(ManagetradiePage),
  ],
})
export class ManagetradiePageModule {}
