import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Platform, IonicPage, NavController, NavParams, ToastController, MenuController, LoadingController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { HttpClient } from '@angular/common/http';
import { FirstRunPage } from '../pages';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { Freelancelist1Page } from '../freelancelist1/freelancelist1';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';
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
  Error:string="";
	ShowPassword:boolean=false;
  // Our translated text strings
  private loginErrorString: string;
	DeviceID:string="";
	LoginType:number=1;
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
	public device:Device,
	public httpClient:HttpClient,
	public menuController:MenuController,
	public navParams:NavParams, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider, public myApp:MyApp, public loadingCtrl:LoadingController) {
		this.menuController.swipeEnable(false);
		this.TryLogin();
	  
	  
	//this.TryLogin();
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
  
  Login(){
	  
	  let scope=this;
	  if(scope.commonProvider.DeviceID==null)
	  {
		  scope.presentToast("Something is wrong");
		  return;
	  }
	if(scope.account.username!="" && scope.account.password!="")
	{
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container" style="height:100%; width:100%;">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		scope.httpClient.post<any>(this.source+'/api/login',{
			DeviceID:scope.commonProvider.DeviceID,
			username:scope.account.username,
			password:scope.account.password,
			login_type:scope.LoginType,
		})
		.subscribe(data => {
			if(data.Error==0)
			{
				scope.RetrieveUserData().then(()=>{setTimeout(() => {
						loader.dismiss();
						scope.TryLogin();
						scope.presentToast("Login successful");
						
					}, 1000);})
				.catch(err=>{scope.presentToast("Something is wrong"); loader.dismiss();});
			}
			else
			{
				scope.presentToast(data.Message);
				loader.dismiss();
			}
			
		},
		err => {
			scope.Error=JSON.stringify(err);
			loader.dismiss();
		})
	}
	else{
		scope.presentToast("Please fill up data");
	}
	
  }
  RetrieveUserData()
  {
	  let scope=this;
	  return new Promise(function(resolve,reject) {
			scope.commonProvider.GetLoginDetails(scope.commonProvider.DeviceID);
			resolve();
		});
  }
  TryLogin()
	{
		
		if(this.commonProvider.Status!=0)
		{
			this.myApp.CheckLogin();
			if(this.commonProvider.User.Role=="Tradie")
			{
				this.navCtrl.setRoot("TradiehomePage");
			}
			else if(this.commonProvider.Role=="Admin")
			{
				this.navCtrl.setRoot("AdminhomePage");
			}
			else
			{
				this.navCtrl.setRoot("ContentPage");
			}
		}
	}
	ForgotPassword()
	{
		this.navCtrl.push('ForgotpasswordPage');
	}
	SignUp()
	{
		this.navCtrl.push('Signup1Page');
	}
}
