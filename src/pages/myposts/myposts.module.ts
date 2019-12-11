import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MypostsPage } from './myposts';

@NgModule({
  declarations: [
    MypostsPage,
  ],
  imports: [
    IonicPageModule.forChild(MypostsPage),
  ],
})
export class MypostsPageModule {}
