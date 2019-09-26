import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Freelancelist7Page } from '../freelancelist7/freelancelist7';
@IonicPage()
@Component({
  selector: 'page-freelancelist6',
  templateUrl: 'freelancelist6.html',
})
export class Freelancelist6Page {
	services:string="";
	fl_basic_id:number=0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public modalCtrl: ModalController) {
	  this.fl_basic_id=this.navParams.get("basic_id");
	  this.LoadService();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist6Page');
  }
	GoPrevious()
	{
		this.navCtrl.setRoot('Freelancelist5Page',{basic_id:this.fl_basic_id});
	}
	Skip()
	{
		this.navCtrl.setRoot(Freelancelist7Page,{basic_id:this.fl_basic_id});
	}
	SaveService()
	{
		this.fl_basic_id=this.navParams.get("basic_id");
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/SaveService',{
			fl_basic_id:this.fl_basic_id,
			services:this.services
		}).subscribe(data => {
			this.navCtrl.setRoot(Freelancelist7Page,{basic_id:this.fl_basic_id});
		},
		err => {
			
		});		
	}
	LoadService()
	{
		this.fl_basic_id=this.navParams.get("basic_id");
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetService',{
			basic_id:this.fl_basic_id
		}).subscribe(data => {
			if(data.Service!=null)
			{
				this.services=data.Service.services;
			}
		},
		err => {
			
		});		
	}

}
