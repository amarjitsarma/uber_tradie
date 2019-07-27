import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobpostPage } from './jobpost';

@NgModule({
  declarations: [
    JobpostPage,
  ],
  imports: [
    IonicPageModule.forChild(JobpostPage),
  ],
})
export class JobpostPageModule {}
