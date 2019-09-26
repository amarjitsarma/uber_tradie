import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, MenuController, ModalController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { HttpClient } from '@angular/common/http';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { firstname: string, lastname: string, phone: string, email: string, username: string, password: string,Terms:boolean } = {
    firstname: '',
	lastname: '',
	phone: '',
    email: '',
	username: '',
    password: '',
	Terms:false
  };
	DeviceID:string="";
  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
	public device:Device,
	public httpClient:HttpClient, 
	public menuController:MenuController,
	public modalController:ModalController) {
		this.menuController.swipeEnable(false);
		this.TryLogin();
		this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
		this.signupErrorString = value;
    });
  }
  presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }
  Terms()
  {
	  let addModal = this.modalController.create('TermsPage');
		addModal.present();
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
			if(data.Status==1)
			{
				this.navCtrl.setRoot("ContentPage");
			}
		},
		err => {
			
		})
	}
  SignUp()
  {
	  if(this.account.Terms==false)
	  {
		  this.presentToast("You must accept Terms & Conditions");
		  return false;
	  }
	  this.DeviceID=this.device.uuid;
	if(this.DeviceID==null)
	{
		this.DeviceID="534b8b5aeb906015";
	}
	if(this.account.firstname!="" && this.account.lastname!="" && this.account.phone!="" && this.account.email!="" && this.account.username!="" && this.account.password!="")
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/signup',{
			DeviceID:this.DeviceID,
			firstname:this.account.firstname,
			lastname:this.account.lastname,
			phone:this.account.phone,
			email:this.account.email,
			username:this.account.username,
			password:this.account.password
		})
		.subscribe(data => {
			if(data.status==0)
			{
				this.presentToast(data.message);
			}
			else
			{
				this.navCtrl.setRoot("OtpPage",{email:this.account.email});
			}
		},
		err => {
			
		})
	}
	else{
		this.presentToast("Please fill up data");
	}
	  
  }
  Login()
  {
	  this.navCtrl.setRoot("LoginPage");
  }
  CheckLogin()
  {
	  
  }
}
