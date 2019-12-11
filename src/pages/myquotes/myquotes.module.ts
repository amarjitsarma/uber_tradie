import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyquotesPage } from './myquotes';

@NgModule({
  declarations: [
    MyquotesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyquotesPage),
  ],
})
export class MyquotesPageModule {}
