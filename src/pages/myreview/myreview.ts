import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-myreview',
  templateUrl: 'myreview.html',
})
export class MyreviewPage {
	Tasks:any=[];
	DeviceID:string="";
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider){
	  this.LoadProjects();
  }
  
  
	LoadProjects()
	{
		this.httpClient.post<any>(this.source+'/api/GetMyReviewedTasks',{device_id:this.commonProvider.DeviceID}).subscribe(data => {
			this.Tasks=data.Tasks;
		},
		err => {
				console.log(err);	
		});
	}
	GoDetail(id)
	{
		this.navCtrl.push('ProjectdetailPage',{ProjectID:id,Mine:1,Task:1});
	}
	
	ViewReviews()
	{
		this.navCtrl.pop();
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyreviewPage');
  }

}
