import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AdminhomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adminhome',
  templateUrl: 'adminhome.html',
})
export class AdminhomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminhomePage');
  }
	Goto(page)
	{
		if(page=="Profile")
		{
			this.navCtrl.push("EditprofilePage");
		}
		else if(page=="Tradie")
		{
			this.navCtrl.push("ManagetradiePage");
		}
		else if(page=="Customer")
		{
			this.navCtrl.push("AdmincustomerPage");
		}
		else if(page=="Admin")
		{
			this.navCtrl.push("AdminadminPage");
		}
		else if(page=="Payment")
		{
			this.navCtrl.push("AdminpaymentPage");
		}
		else if(page=="Settings")
		{
			this.navCtrl.push("AdminsettingPage");
		}
	}
}
