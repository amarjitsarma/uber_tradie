import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategorylistPage } from './categorylist';

@NgModule({
  declarations: [
    CategorylistPage,
  ],
  imports: [
    IonicPageModule.forChild(CategorylistPage),
  ],
})
export class CategorylistPageModule {}
