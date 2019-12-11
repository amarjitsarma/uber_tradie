import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SynchtestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-synchtest',
  templateUrl: 'synchtest.html',
})
export class SynchtestPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
	this.one().then(()=>{this.two()});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SynchtestPage');
  }
	one()
	{
		var r=JSON.stringify({Status:1});
		alert("first function called");
		return new Promise(function(resolve,reject) {
			console.log("Yello");
			resolve();
		});
	}
	two()
	{
		alert("second function called");
	}
	

}
