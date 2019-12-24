import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-taglinecreate',
  templateUrl: 'taglinecreate.html',
})
export class TaglinecreatePage {
	tagline:string="";
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaglinecreatePage');
  }
  cancel() {
    this.viewCtrl.dismiss();
  }
	SaveTagline()
	{
		if(this.tagline!="")
		{
			this.httpClient.post<any>(this.source+'/api/SaveNewTagline',{
				tagline:this.tagline
			}).subscribe(data => {
				this.viewCtrl.dismiss("done");
			},
			err => {
				alert("Unable to save");		
			});
		}
	}

}
