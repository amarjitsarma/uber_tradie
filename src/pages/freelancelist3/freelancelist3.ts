import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav, MenuController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-freelancelist3',
  templateUrl: 'freelancelist3.html',
})
export class Freelancelist3Page {
	
	fl_basic_id:number=0;
	phone:string="";
	mobile:string="";
	email:string="";
	website:string="";
	contact_name:string="";
	DeviceID:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public menuController:MenuController) {
	  this.fl_basic_id=this.navParams.get("basic_id");
	  this.LoadContact();
	  this.menuController.swipeEnable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist3Page');
  }
  GoPrevious()
  {
	  this.navCtrl.setRoot('Freelancelist2Page',{basic_id:this.fl_basic_id});
  }
  SaveContact()
  {
	  this.httpClient.post<any>('http://uber.ptezone.com.au/api/SaveContact',{
		  fl_basic_id:this.fl_basic_id,
		  phone:this.phone,
		  mobile:this.mobile,
		  email:this.email,
		  website:this.website,
		  contact_name:this.contact_name
	  }).subscribe(data => {
			this.navCtrl.setRoot('Freelancelist4Page',{basic_id:this.fl_basic_id});
		},
		err => {
				
		});
  }
  LoadContact()
  {
	  this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetContact',{basic_id:this.fl_basic_id})
	  .subscribe(data => {
			if(data.Contact!=null)
			{
				this.phone=data.Contact.phone;
				this.mobile=data.Contact.mobile;
				this.email=data.Contact.email;
				this.website=data.Contact.website;
				this.contact_name=data.Contact.contact_name;
			}
		},
		err => {
				
		});
  }

}
