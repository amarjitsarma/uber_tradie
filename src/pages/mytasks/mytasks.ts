import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { JoblistPage } from '../joblist/joblist';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-mytasks',
  templateUrl: 'mytasks.html',
})
export class MytasksPage {
	Tasks:any=[];
	DeviceID:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider){
	 this.LoadProjects();
  }

	LoadProjects()
	{
		this.httpClient.post<any>('https://ptezone.com.au/api/GetMyBids',{device_id:this.commonProvider.DeviceID}).subscribe(data => {
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
	FindJob()
	{
		this.navCtrl.push(JoblistPage);
	}
	PostedJob()
	{
		//this.navCtrl.pop();
		this.navCtrl.push("MypostsPage");
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad MytasksPage');
  }

}
