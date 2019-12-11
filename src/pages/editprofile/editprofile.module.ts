import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditprofilePage } from './editprofile';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    EditprofilePage,
  ],
  imports: [
	SelectSearchableModule,
	IonicSelectableModule,
    IonicPageModule.forChild(EditprofilePage),
  ],
})
export class EditprofilePageModule {}
