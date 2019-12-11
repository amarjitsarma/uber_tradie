import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MytasksPage } from './mytasks';

@NgModule({
  declarations: [
    MytasksPage,
  ],
  imports: [
    IonicPageModule.forChild(MytasksPage),
  ],
})
export class MytasksPageModule {}
