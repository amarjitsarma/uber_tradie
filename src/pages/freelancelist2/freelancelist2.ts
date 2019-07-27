import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchPage } from './../search/search';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { Freelancelist3Page } from '../freelancelist3/freelancelist3';
import { Freelancelist1Page } from '../freelancelist1/freelancelist1';
@IonicPage()
@Component({
  selector: 'page-freelancelist2',
  templateUrl: 'freelancelist2.html',
})
export class Freelancelist2Page {
	
	fl_basic_id:number=2;
	sunFrom:string="";
	sunTo:string="";
	monFrom:string="";
	monTo:string="";
	tueFrom:string="";
	tueTo:string="";
	wedFrom:string="";
	wedTo:string="";
	thuFrom:string="";
	thuTo:string="";
	friFrom:string="";
	friTo:string="";
	satFrom:string="";
	satTo:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist2Page');
  }
  GoPrevious()
  {
	  this.navCtrl.setRoot(Freelancelist1Page);
  }
  Skip()
  {
	  this.navCtrl.setRoot(Freelancelist3Page);
  }
  SaveWorkingHour()
  {
	  this.httpClient.post<any>('http://uber.ptezone.com.au/api/SaveWorkingHours',{
		  fl_basic_id:this.fl_basic_id,
		  monday:this.monFrom+"-"+this.monTo,
		  tuesday:this.tueFrom+"-"+this.tueTo,
		  wednessday:this.wedFrom+"-"+this.wedTo,
		  thursday:this.thuFrom+"-"+this.thuTo,
		  friday:this.friFrom+"-"+this.friTo,
		  saturday:this.satFrom+"-"+this.satTo,
		  sunday:this.sunFrom+"-"+this.sunTo,
	  }).subscribe(data => {
		this.navCtrl.setRoot(Freelancelist3Page);
	},
	err => {
				
	});
  }

}
