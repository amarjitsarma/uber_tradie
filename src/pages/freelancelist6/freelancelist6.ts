import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav, MenuController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Freelancelist7Page } from '../freelancelist7/freelancelist7';
import { CommondataProvider } from '../../providers/commondata/commondata';
@IonicPage()
@Component({
  selector: 'page-freelancelist6',
  templateUrl: 'freelancelist6.html',
})
export class Freelancelist6Page {
	services:string="";
	fl_basic_id:number=0;
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public modalCtrl: ModalController, public menuController:MenuController, public commonProvider: CommondataProvider) {
	  this.fl_basic_id=this.navParams.get("basic_id");
	  this.LoadService();
	  this.menuController.swipeEnable(false);
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
		this.httpClient.post<any>(this.source+'/api/SaveService',{
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
		this.services=this.commonProvider.services.services;	
	}

}
