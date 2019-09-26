import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
@IonicPage()
@Component({
  selector: 'page-freelancelist2',
  templateUrl: 'freelancelist2.html',
})
export class Freelancelist2Page {
	
	fl_basic_id:number=0;
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
	  this.fl_basic_id=this.navParams.get("basic_id");
	  this.LoadWorkingHours();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist2Page');
  }
  GoPrevious()
  {
	  this.navCtrl.setRoot('Freelancelist1Page');
  }
  Skip()
  {
	  this.navCtrl.setRoot('Freelancelist3Page',{basic_id:this.fl_basic_id});
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
		this.navCtrl.setRoot('Freelancelist3Page',{basic_id:this.fl_basic_id});
	},
	err => {
				
	});
  }
  LoadWorkingHours()
  {
	  this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetWorkingHours',{basic_id:this.fl_basic_id})
		.subscribe(data => {
			console.log(data);
			if(data.WorkingHour!=null)
			{
				this.monFrom=data.WorkingHour.monday.substr(0,data.WorkingHour.monday.indexOf("-"));
				this.monTo=data.WorkingHour.monday.substr(data.WorkingHour.monday.indexOf("-")+1);
				this.tueFrom=data.WorkingHour.tuesday.substr(0,data.WorkingHour.tuesday.indexOf("-"));
				this.tueTo=data.WorkingHour.tuesday.substr(data.WorkingHour.tuesday.indexOf("-")+1);
				this.wedFrom=data.WorkingHour.wednessday.substr(0,data.WorkingHour.wednessday.indexOf("-"));
				this.wedTo=data.WorkingHour.wednessday.substr(data.WorkingHour.wednessday.indexOf("-")+1);
				this.thuFrom=data.WorkingHour.thursday.substr(0,data.WorkingHour.thursday.indexOf("-"));
				this.thuTo=data.WorkingHour.thursday.substr(data.WorkingHour.thursday.indexOf("-")+1);
				this.friFrom=data.WorkingHour.friday.substr(0,data.WorkingHour.friday.indexOf("-"));
				this.friTo=data.WorkingHour.friday.substr(data.WorkingHour.friday.indexOf("-")+1);
				this.satFrom=data.WorkingHour.saturday.substr(0,data.WorkingHour.saturday.indexOf("-"));
				this.satTo=data.WorkingHour.saturday.substr(data.WorkingHour.saturday.indexOf("-")+1);
				this.sunFrom=data.WorkingHour.sunday.substr(0,data.WorkingHour.sunday.indexOf("-"));
				this.sunTo=data.WorkingHour.sunday.substr(data.WorkingHour.sunday.indexOf("-")+1);
			}
		},
		err => {
				console.log(err);	
		});
  }

}
