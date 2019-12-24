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
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider){
	 this.LoadProjects();
  }

	LoadProjects()
	{
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container" style="height:100%; width:100%;">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		this.httpClient.post<any>(this.source+'/api/GetMyBids',{device_id:this.commonProvider.DeviceID}).subscribe(data => {
			this.Tasks=data.Tasks;
			loader.dismiss();
		},
		err => {
			loader.dismiss();
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
