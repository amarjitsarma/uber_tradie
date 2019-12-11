import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content, Platform, ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { JobpostPage } from '../jobpost/jobpost';
import { MyApp } from '../../app/app.component';
import { ImageViewerController } from 'ionic-img-viewer';
import { JobproProvider } from '../../providers/jobpro/jobpro';
declare var StripeCheckout;

@IonicPage()
@Component({
  selector: 'page-progress',
  templateUrl: 'progress.html',
})
export class ProgressPage {
	pre_project:any[]=[];
	post_project:any[]=[];
	messages:any[]=[];
	pre_photos:any[]=[];
	post_photos:any[]=[];
	project_id:any=0;
	user_id:any=0;
	customer_verification:any=0;
	tradie_verification:any=0;
	constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider, public imageViewerController:ImageViewerController, public jobProvider:JobproProvider, public viewCtrl: ViewController)
	{
		this.project_id=this.navParams.get("project_id");
		this.user_id=this.navParams.get("project_user");
	}
	LoadProgress()
	{
		let project_id=this.navParams.get("project_id");
		this.httpClient.post<any>('https://ptezone.com.au/api/GetProjectProgress',{
			project_id:project_id
		}).subscribe(data => {
			this.pre_project=data.pre_project;
			this.post_project=data.post_project;
			this.messages=data.on_process;
			if(data.verification_tradie!=null)
			{
				this.tradie_verification=1;
			}
			else if(data.verification_customer!=null)
			{
				this.tradie_verification=1;
				this.customer_verification=1;
			}
		},
		err => {
				console.log(err);	
		});
	}
	ionViewDidLoad()
	{
		console.log('ionViewDidLoad ProgressPage');
	}
	ionViewDidEnter()
	{
		this.LoadProgress();
	}
	presentImage(myImage) {
		const imageViewer = this.imageViewerController.create(myImage);
		imageViewer.present();
	}
	AddPhoto(s)
	{
		let addModal = this.modalCtrl.create('ItemCreatePage',{avatar:1});
		addModal.onDidDismiss(item => {
			if (item) {
				if(s==1)
				{
					this.pre_photos.push(item.upload);
				}
				else
				{
					this.post_photos.push(item.upload);
				}
			}
		})
		addModal.present();
	}
	UploadPreTask()
	{
		if(this.pre_photos.length+this.pre_project.length<5)
		{
			alert("Please select at least 5 photos");
		}
		else
		{
			alert(JSON.stringify(this.pre_photos));
			let project_id=this.navParams.get("project_id");
			this.httpClient.post<any>('https://ptezone.com.au/api/SaveProjectProgress',{
				user_id:this.commonProvider.User.id,
				project_id:project_id,
				photos:this.pre_photos,
				project_status:1
			}).subscribe(data => {
				this.LoadProgress();
				this.pre_photos=[];
			},
			err => {
					console.log(err);	
			});
		}
	}
	UploadPostTask()
	{
		if(this.post_photos.length+this.post_project.length<5)
		{
			alert("Please select at least 5 photos");
		}
		else
		{
			let project_id=this.navParams.get("project_id");
			this.httpClient.post<any>('https://ptezone.com.au/api/SaveProjectProgress',{
				user_id:this.commonProvider.User.id,
				project_id:project_id,
				photos:this.post_photos,
				project_status:3
			}).subscribe(data => {
				this.LoadProgress();
				this.post_photos=[];
			},
			err => {
					console.log(err);	
			});
		}
	}
	message:string="";
	SendMessage()
	{
		let project_id=this.navParams.get("project_id");
		this.httpClient.post<any>('https://ptezone.com.au/api/SaveProjectProgress',{
			user_id:this.commonProvider.User.id,
			project_id:project_id,
			message:this.message,
			project_status:2
		}).subscribe(data => {
			this.LoadProgress();
			this.message="";
		},
		err => {
				console.log(err);	
		});
	}
	VerifyComplete(project_status)
	{
		let project_id=this.navParams.get("project_id");
		this.httpClient.post<any>('https://ptezone.com.au/api/SaveProjectProgress',{
			user_id:this.commonProvider.User.id,
			project_id:project_id,
			project_status:project_status
		}).subscribe(data => {
			this.LoadProgress();
			if(project_status==5)
			{
				this.navCtrl.pop();
			}
		},
		err => {
				console.log(err);	
		});
	}
}
