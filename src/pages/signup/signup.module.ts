import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { SignupPage } from './signup';

@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
	SelectSearchableModule,
    IonicPageModule.forChild(SignupPage),
    TranslateModule.forChild()
  ],
  exports: [
    SignupPage
  ]
})
export class SignupPageModule { }
