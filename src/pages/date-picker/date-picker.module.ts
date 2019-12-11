import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatePickerPage } from './date-picker';
//Calender
import { DatePickerModule } from 'ionic-calendar-date-picker';

@NgModule({
  declarations: [
    DatePickerPage,
  ],
  imports: [
	DatePickerModule,
    IonicPageModule.forChild(DatePickerPage),
  ],
})
export class DatePickerPageModule {}
