import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubcategorylistPage } from './subcategorylist';

@NgModule({
  declarations: [
    SubcategorylistPage,
  ],
  imports: [
    IonicPageModule.forChild(SubcategorylistPage),
  ],
})
export class SubcategorylistPageModule {}
