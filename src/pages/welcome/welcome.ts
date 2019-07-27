import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { HttpClient } from '@angular/common/http';

import { ContentPage } from '../content/content';
/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
	DeviceID:string="";
  constructor(public navCtrl: NavController, public device:Device, public httpClient:HttpClient) {
	  this.checklogin();
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
  checklogin()
  {
	this.DeviceID=this.device.uuid;
	if(this.DeviceID==null)
	{
		this.DeviceID="534b8b5aeb906015";
	}
	this.httpClient.post<any>('http://uber.ptezone.com.au/api/CheckLogin',{
		DeviceID:this.DeviceID
	})
	.subscribe(data => {
		if(data.Status==1)
		{
			this.navCtrl.setRoot('ContentPage');
		}
	},
	err => {
		
	})

  }
}
