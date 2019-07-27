import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JoblistPage } from './joblist';

@NgModule({
  declarations: [
    JoblistPage,
  ],
  imports: [
    IonicPageModule.forChild(JoblistPage),
  ],
})
export class JoblistPageModule {}
