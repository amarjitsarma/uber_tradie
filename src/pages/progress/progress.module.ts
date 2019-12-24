import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProgressPage } from './progress';
import { StarRatingModule } from 'ionic3-star-rating';
@NgModule({
  declarations: [
    ProgressPage,
  ],
  imports: [
	StarRatingModule,
    IonicPageModule.forChild(ProgressPage),
  ],
})
export class ProgressPageModule {}
