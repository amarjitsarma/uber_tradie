import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController, ModalController, AlertController, Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { HttpClient } from '@angular/common/http';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {
	email:string="";

  constructor(public navCtrl: NavController,
	public navParams: NavParams,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
	public device:Device,
	public httpClient:HttpClient, 
	public menuController:MenuController,
	public modalController:ModalController,
	public alertCtrl: AlertController, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider) {
	  this.menuController.swipeEnable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }
  Login()
  {
	  this.navCtrl.setRoot("LoginPage");
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
  ResetPassword()
  {
	  if(this.email!="")
	  {
		  if(this.ValidateEmail(this.email))
		  {
			this.showConfirm();
		  }
		  else
		  {
			  this.showAlert("Error","Invalid Email ID");
		  }
	  }
	  else
	  {
		  this.showAlert("Error","Please enter an Email ID");
	  }
  }
  UpdatePassword()
  {
	  this.httpClient.post<any>('https://ptezone.com.au/api/ResetPassword',{
			email:this.email
		})
		.subscribe(data => {
			if(data.Status==1)
			{
				this.showAlert("Success",data.Message);
				this.navCtrl.setRoot("LoginPage");
			}
			else
			{
				this.showAlert("Error",data.Message);
			}
		},
		err => {
			
		})
  }
  showAlert(title, message) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Do you want to continue?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            return false;
          }
        },
        {
          text: 'Agree',
          handler: () => {
			this.UpdatePassword();
          }
        }
      ]
    });
    confirm.present();
  }
}
