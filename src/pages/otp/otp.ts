import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Platform, IonicPage, NavController, ToastController, MenuController, ModalController, NavParams, LoadingController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { HttpClient } from '@angular/common/http';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { Freelancelist1Page } from '../freelancelist1/freelancelist1';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
	DeviceID:string="";
	otp:string="";
	main_data:{device_id:string, otp:string, firstname:string, lastname:string, phone:string, email:string, username:string, password:string, login_type: any, location: string, street_name:string, state:string, code:string, postcode:string, longitude:any, latitude:any, category:any, sub_category:any};
	constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
	public device:Device,
	public httpClient:HttpClient, 
	public menuController:MenuController,
	public modalController:ModalController,
	public loadingCtrl:LoadingController,
	public navParams:NavParams, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider, public myApp: MyApp){
		this.TryLogin();
		this.main_data=this.navParams.get("main_data");
	}
	
  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage');
  }
	presentToast(Message) {
		const toast = this.toastCtrl.create({
			message: Message,
			duration: 3000
		});
		toast.present();
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
			if(this.commonProvider.User.Role=="Tradie" || this.commonProvider.Role=="Admin")
			{
				this.navCtrl.setRoot("TradiehomePage");
			}
			else
			{
				this.navCtrl.setRoot("ContentPage");
			}
		}
	}
	ResendCode()
	{
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		this.httpClient.post<any>('https://ptezone.com.au/api/ResendVerification',{
			email: this.main_data.email
		})
		.subscribe(data => {
			setTimeout(()=>{
				loader.dismiss();
				this.presentToast(data.Message);
			},2000);
		},
		err => {
			loader.dismiss();
		})
	}
	
	Verify()
	{
		let scope=this;
		if(scope.otp.length==0)
		{
			scope.presentToast("Please check your your email for the verification code.");
			return;
		}
		
		scope.main_data.otp=scope.otp;
		this.httpClient.post<any>('https://ptezone.com.au/api/signup',scope.main_data)
		.subscribe(data => {
			this.presentToast(data.message);
			if(data.status==1)
			{
				let loader:any = this.loadingCtrl.create({
				spinner: "hide",
				content: `<div class="custom-spinner-container">
								<div class="custom-spinner-box">
									<img src="assets/img/spinner.gif" width="100%"/>
								</div>
							</div>`
				});
				loader.present();
				scope.RetrieveUserData().then(()=>{setTimeout(() => {
						loader.dismiss();
						scope.TryLogin();
						
					}, 2000);})
				.catch(err=>{scope.presentToast("Something is wrong"); loader.dismiss();});
			}
		},
		err => {
			
		})
	}
	Login()
	{
		this.navCtrl.setRoot("LoginPage");
	}
}
