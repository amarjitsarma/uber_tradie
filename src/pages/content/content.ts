import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Freelancelist1Page } from '../freelancelist1/freelancelist1';
@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})
export class ContentPage {

  constructor(public navCtrl: NavController) { }
	FreeLancer(){
		this.navCtrl.setRoot(Freelancelist1Page);
	}
}
