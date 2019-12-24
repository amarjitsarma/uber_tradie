import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav, MenuController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { CommondataProvider } from '../../providers/commondata/commondata';
@IonicPage()
@Component({
  selector: 'page-freelancelist5',
  templateUrl: 'freelancelist5.html',
})
export class Freelancelist5Page {

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public modalCtrl: ModalController, public menuController:MenuController, public commonProvider: CommondataProvider) {
	  this.fl_basic_id=this.navParams.get("basic_id");
	  this.LoadAbout();
	  this.menuController.swipeEnable(false);
  }
	short_desc:string="";
	about:string="";
	fl_basic_id:number=0;
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist5Page');
  }
	GoPrevious()
	{
		this.navCtrl.setRoot('Freelancelist4Page',{basic_id:this.fl_basic_id});
	}
	SaveAbout()
	{
		this.fl_basic_id=this.navParams.get("basic_id");
		this.httpClient.post<any>(this.source+'/api/SaveAbout',{
			fl_basic_id:this.fl_basic_id,
			short_desc:this.short_desc,
			about:this.about
		}).subscribe(data => {
			this.commonProvider.LoadAbout();
			this.navCtrl.setRoot('Freelancelist6Page',{basic_id:this.fl_basic_id});
		},
		err => {
			
		});		
	}
	LoadAbout()
	{
		this.short_desc=this.commonProvider.about.short_desc;
		this.about=this.commonProvider.about.about;
	}

}
