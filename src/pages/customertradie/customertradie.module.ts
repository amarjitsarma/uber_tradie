import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomertradiePage } from './customertradie';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    CustomertradiePage,
  ],
  imports: [
	SelectSearchableModule,
	IonicSelectableModule,
    IonicPageModule.forChild(CustomertradiePage),
  ],
})
export class CustomertradiePageModule {}
