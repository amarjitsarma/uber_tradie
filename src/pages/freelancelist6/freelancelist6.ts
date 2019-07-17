import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchPage } from './../search/search';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Freelancelist5Page } from '../freelancelist5/freelancelist5';
import { Freelancelist7Page } from '../freelancelist7/freelancelist7';

@IonicPage()
@Component({
  selector: 'page-freelancelist6',
  templateUrl: 'freelancelist6.html',
})
export class Freelancelist6Page {

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist6Page');
  }
	GoPrevious()
	{
		this.navCtrl.setRoot(Freelancelist5Page);
	}
	Skip()
	{
		this.navCtrl.setRoot(Freelancelist7Page);
	}
	SaveService()
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/SaveService',{
			fl_basic_id:1,
			service:this.service
		}).subscribe(data => {
			this.navCtrl.setRoot(Freelancelist7Page);
		},
		err => {
			
		});		
	}


}
