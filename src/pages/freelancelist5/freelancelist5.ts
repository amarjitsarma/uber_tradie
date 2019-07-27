import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchPage } from './../search/search';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Freelancelist4Page } from '../freelancelist4/freelancelist4';
import { Freelancelist6Page } from '../freelancelist6/freelancelist6';
@IonicPage()
@Component({
  selector: 'page-freelancelist5',
  templateUrl: 'freelancelist5.html',
})
export class Freelancelist5Page {

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public modalCtrl: ModalController) {
  }
	short_desc:string="";
	about:string="";
  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist5Page');
  }
	GoPrevious()
	{
		this.navCtrl.setRoot(Freelancelist4Page);
	}
	SaveAbout()
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/SaveAbout',{
			fl_basic_id:2,
			short_desc:this.short_desc,
			about:this.about
		}).subscribe(data => {
			this.navCtrl.setRoot(Freelancelist5Page);
		},
		err => {
			
		});		
	}

}
