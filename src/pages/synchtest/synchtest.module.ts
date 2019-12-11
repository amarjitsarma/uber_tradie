import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SynchtestPage } from './synchtest';

@NgModule({
  declarations: [
    SynchtestPage,
  ],
  imports: [
    IonicPageModule.forChild(SynchtestPage),
  ],
})
export class SynchtestPageModule {}
