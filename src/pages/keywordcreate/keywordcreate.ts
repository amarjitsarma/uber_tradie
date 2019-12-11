import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';
/**
 * Generated class for the KeywordcreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-keywordcreate',
  templateUrl: 'keywordcreate.html',
})
export class KeywordcreatePage {
	keyword:string="";
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KeywordcreatePage');
  }
	SaveKeyword()
	{
		if(this.keyword!="")
		{
			this.httpClient.post<any>('https://ptezone.com.au/api/SaveNewKeyword',{
				keyword:this.keyword
			}).subscribe(data => {
				this.viewCtrl.dismiss("done");
			},
			err => {
				alert("Unable to save");		
			});
		}
	}
	cancel() {
		this.viewCtrl.dismiss();
	}
}
