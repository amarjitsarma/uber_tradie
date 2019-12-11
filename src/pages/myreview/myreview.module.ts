import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyreviewPage } from './myreview';

@NgModule({
  declarations: [
    MyreviewPage,
  ],
  imports: [
    IonicPageModule.forChild(MyreviewPage),
  ],
})
export class MyreviewPageModule {}
