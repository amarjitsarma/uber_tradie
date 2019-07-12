import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { HttpClient } from '@angular/common/http';
import { FirstRunPage } from '../pages';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { username: string, password: string } = {
    username: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
	public device:Device,
	public httpClient:HttpClient) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  Login() {
    this.DeviceID=this.device.uuid;
	if(this.DeviceID==null)
	{
		this.DeviceID="534b8b5aeb906015";
	}
	if(this.account.username!="" && this.account.password!="")
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/login',{
			DeviceID:this.DeviceID,
			username:this.account.username,
			password:this.account.password
		})
		.subscribe(data => {
			if(data.Error!=0)
			{
				alert("Correct details");
			}
			else
			{
				alert("Incorrect details");
			}
		},
		err => {
			
		})
	}
	else{
		alert("Please fill up data");
	}
  }
}
