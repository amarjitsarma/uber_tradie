import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewcategoryPage } from './newcategory';

@NgModule({
  declarations: [
    NewcategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(NewcategoryPage),
  ],
})
export class NewcategoryPageModule {}
