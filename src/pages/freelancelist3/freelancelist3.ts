import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchPage } from './../search/search';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { Freelancelist4Page } from '../freelancelist4/freelancelist4';
import { Freelancelist2Page } from '../freelancelist2/freelancelist2';

@IonicPage()
@Component({
  selector: 'page-freelancelist3',
  templateUrl: 'freelancelist3.html',
})
export class Freelancelist3Page {
	
	fl_basic_id:number=2;
	phone:string="";
	mobile:string="";
	email:string="";
	website:string="";
	contact_name:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist3Page');
  }
  GoPrevious()
  {
	  this.navCtrl.setRoot(Freelancelist2Page);
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
		this.navCtrl.setRoot(Freelancelist4Page);
	},
	err => {
				
	});
  }

}
