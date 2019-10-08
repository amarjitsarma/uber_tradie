import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { HttpClient } from '@angular/common/http';
import { FirstRunPage } from '../pages';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { Freelancelist1Page } from '../freelancelist1/freelancelist1';

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
	DeviceID:string="";
	LoginType:number=1;
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
	public device:Device,
	public httpClient:HttpClient,
	public menuController:MenuController,
	public navParams:NavParams) {
		this.menuController.swipeEnable(false);
	this.TryLogin();
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });
	this.LoginType=this.navParams.get("LoginType");
	
  }
  presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
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
			password:this.account.password,
			login_type:this.LoginType,
		})
		.subscribe(data => {
			if(data.Error==0)
			{
				this.presentToast("Login successful");
				location.reload();
				//this.navCtrl.setRoot("LoginasPage");
			}
			else
			{
				this.presentToast("Incorrect Username or Password");
			}
		},
		err => {
			
		})
	}
	else{
		this.presentToast("Please fill up data");
	}
  }
  TryLogin()
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
			if(data.Status!=0)
			{
				if(data.User.Role=="Tradie" || data.User.Role=="Admin")
				{
					this.navCtrl.setRoot("TradiehomePage");
					/*if(data.User.Tradie==null || data.User.Tradie.status==0)
					{
						this.navCtrl.setRoot(Freelancelist1Page);
					}
					else
					{
						this.navCtrl.setRoot("ContentPage");
					}*/
				}
				else
				{
					this.navCtrl.setRoot("ContentPage");
				}
			}
		},
		err => {
			
		})
	}
	ForgotPassword()
	{
		this.navCtrl.setRoot('ForgotpasswordPage');
	}
	SignUp()
	{
		this.navCtrl.setRoot('Signup1Page');
	}
}
