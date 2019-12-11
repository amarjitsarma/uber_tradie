import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content, ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';

@IonicPage()
@Component({
  selector: 'page-admincreate',
  templateUrl: 'admincreate.html',
})
export class AdmincreatePage {
	
	first_name:string="";
	last_name:string="";
	username:string="";
	email:string="";
	phone:string="";
	password:string="";
	con_password:string="";
	id:any=0;
	code:any="";

	constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider, public viewCtrl: ViewController) {
		if(this.navParams.get("Admin"))
		{
			let Admin=this.navParams.get("Admin");
			this.first_name=Admin.first_name;
			this.last_name=Admin.last_name;
			this.username=Admin.username;
			this.email=Admin.email;
			this.phone=Admin.phone;
			this.password=Admin.password;
			this.con_password=Admin.con_password;
			this.id=Admin.id;
			this.code=Admin.code;
		}
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmincreatePage');
  }
	presentToast(Message) {
		const toast = this.toastCtrl.create({
			message: Message,
			duration: 3000
		});
		toast.present();
	}
	AddAdmin()
	{
		if(this.first_name=="")
		{
			this.presentToast("Please enter the first name");
			return false;
		}
		if(this.last_name=="")
		{
			this.presentToast("Please enter the last name");
			return false;
		}
		if(this.username=="")
		{
			this.presentToast("Please enter the username");
			return false;
		}
		if(this.email=="")
		{
			this.presentToast("Please enter the email id");
			return false;
		}
		if(this.ValidateEmail(this.email)==false)
		{
			this.presentToast("Please enter a valid email id");
			return false;
		}
		if(this.phone=="")
		{
			this.presentToast("Please enter the phone no");
			return false;
		}
		if(this.ValidateContact(this.phone)==false)
		{
			this.presentToast("Please enter a valid phone no");
			return false;
		}
		if(this.password=="")
		{
			this.presentToast("Please enter a password");
			return false;
		}
		if(this.con_password=="")
		{
			this.presentToast("Please enter the confirm password");
			return false;
		}
		if(this.password!=this.con_password)
		{
			this.presentToast("Password & Confirm passwords are not matching");
			return false;
		}
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		this.httpClient.post<any>('https://ptezone.com.au/api/SaveAdmin',
		{
			first_name:this.first_name,
			last_name:this.last_name,
			username:this.username,
			email:this.email,
			phone:this.phone,
			password:this.password
		}).subscribe(data => {
			loader.dismiss();
			alert(data.message);
			if(data.error==0)
			{
				this.navCtrl.pop();
			}
		},
		err => {
			loader.dismiss();
			console.log(err);	
		});
	}
	UpdateAdmin()
	{
		if(this.first_name=="")
		{
			this.presentToast("Please enter the first name");
			return false;
		}
		if(this.last_name=="")
		{
			this.presentToast("Please enter the last name");
			return false;
		}
		if(this.username=="")
		{
			this.presentToast("Please enter the username");
			return false;
		}
		if(this.email=="")
		{
			this.presentToast("Please enter the email id");
			return false;
		}
		if(this.ValidateEmail(this.email)==false)
		{
			this.presentToast("Please enter a valid email id");
			return false;
		}
		if(this.phone=="")
		{
			this.presentToast("Please enter the phone no");
			return false;
		}
		if(this.ValidateContact(this.phone)==false)
		{
			this.presentToast("Please enter a valid phone no");
			return false;
		}
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		this.httpClient.post<any>('https://ptezone.com.au/api/UpdateAdmin',
		{
			id:this.id,
			first_name:this.first_name,
			last_name:this.last_name,
			username:this.username,
			email:this.email,
			phone:this.phone
		}).subscribe(data => {
			loader.dismiss();
			alert(data.message);
			if(data.error==0)
			{
				this.navCtrl.pop();
			}
		},
		err => {
			loader.dismiss();
			console.log(err);	
		});
	}
	ValidateEmail(email_id)
	{
		var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if(!re.test(email_id)) {
			return false;
		}
		else
		{
			return true;
		}
	}
	ValidateContact(phone)
	{
		if(phone!="")
		{
			var re = /^(((([\+]61[1-9]{0,1}|([\(]{0,1}0[\)]{0,1}[1-9]{1}|[\(]{0,1}0[1-9]{1}[\)]{0,1})))([0-9]{8}|([\\s*]|[\-]{1})[0-9]{3}([\\s*]|[\-]{1})[0-9]{3}([\\s*]|[\-]{1})[0-9]{3}|(([\\s*]|[\-]{0,1})[0-9]{4}([\\s*]|[\-]{0,1})[0-9]{4})))|((1([\\s*]|[\-]{0,1})((300|800|900|902)|3[0-9]{2}))([\\s*]|[\-]{0,1})([0-9]{3}([\\s*]|[\-]{0,1})[0-9]{3}|[0-9]{6}))|((13[0-9]{1}([\\s*]|[\-]){0,1}[0-9]{3}|13([\\s*]|[\-]){1}[0-9]{2}([\\s*]|[\-]){1}[0-9]{2})))$/;
			if(!re.test(phone)) {
				return false;
			}
			else
			{
				return true;
			}
		}
		else
		{
			return true;
		}
	}
	ActivateAdmin(status)
	{
		let scope=this;
		const confirm = this.alertCtrl.create({
			title: 'Confirm!',
			message: 'Are you sure?',
			buttons: [
				{
					text: 'No',
					handler: () => {
						console.log('Disagree clicked');
					}
				},
				{
					text: 'Yes',
					handler: () => {
						let loader:any = scope.loadingCtrl.create({
						spinner: "hide",
						content: `<div class="custom-spinner-container">
										<div class="custom-spinner-box">
											<img src="assets/img/spinner.gif" width="100%"/>
										</div>
									</div>`
						});
						loader.present();
						scope.httpClient.post<any>('https://ptezone.com.au/api/AcivationAdmin',
						{
							id:scope.id,
							status:status
						}).subscribe(data => {
							loader.dismiss();
							alert(data.message);
							if(data.error==0)
							{
								scope.navCtrl.pop();
							}
						},
						err => {
							loader.dismiss();
							console.log(err);	
						});
					}
				}
			]
		});
		confirm.present();
		
	}
	DeleteAdmin()
	{
		let scope=this;
		const confirm = this.alertCtrl.create({
			title: 'Confirm!',
			message: 'Are you sure?',
			buttons: [
				{
					text: 'No',
					handler: () => {
						console.log('Disagree clicked');
					}
				},
				{
					text: 'Yes',
					handler: () => {
						let loader:any = scope.loadingCtrl.create({
						spinner: "hide",
						content: `<div class="custom-spinner-container">
										<div class="custom-spinner-box">
											<img src="assets/img/spinner.gif" width="100%"/>
										</div>
									</div>`
						});
						loader.present();
						scope.httpClient.post<any>('https://ptezone.com.au/api/DeleteAdmin',
						{
							id:scope.id
						}).subscribe(data => {
							loader.dismiss();
							alert(data.message);
							if(data.error==0)
							{
								scope.navCtrl.pop();
							}
						},
						err => {
							loader.dismiss();
							console.log(err);	
						});
					}
				}
			]
		});
		confirm.present();
		
	}
}
