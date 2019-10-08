import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectdetailPage } from './projectdetail';
import { StarRatingModule } from 'ionic3-star-rating';
@NgModule({
  declarations: [
    ProjectdetailPage,
  ],
  imports: [
	StarRatingModule,
    IonicPageModule.forChild(ProjectdetailPage),
  ],
})
export class ProjectdetailPageModule {}
