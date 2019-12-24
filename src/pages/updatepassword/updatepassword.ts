import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';
@IonicPage()
@Component({
  selector: 'page-updatepassword',
  templateUrl: 'updatepassword.html',
})
export class UpdatepasswordPage {
	DeviceID:string="";
	c_passwrd:string="";
	n_password:string="";
	con_password:string="";
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient:HttpClient, public device:Device, public toastCtrl: ToastController, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider) {
	  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatepasswordPage');
  }
  
  ChangePassword()
  {
	  if(this.n_password=='')
	  {
		  this.presentToast("New password cannot be empty");
	  }
	  else if(this.n_password!=this.con_password)
	  {
		  this.presentToast("New password & confirm password should be same");
	  }
	  else
	  {
		   
			this.httpClient.post<any>(this.source+'/api/UpdatePassword',{
				DeviceID:this.commonProvider.DeviceID,
				c_passwrd:this.c_passwrd,
				n_password:this.n_password,
				con_password:this.con_password
			})
			.subscribe(data => {
				this.presentToast(data.Message);
				if(data.Error==0)
				{
					this.navCtrl.setRoot("EditprofilePage");
				}
			},
			err => {
				
			})
	  }
  }
  presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }

}
