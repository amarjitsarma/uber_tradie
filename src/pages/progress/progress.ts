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
	pre_photos_display:any[]=[];
	post_photos_display:any[]=[];
	project_id:any=0;
	user_id:any=0;
	customer_verification:any=0;
	tradie_verification:any=0;
	source:string="https://ptezone.com.au";//"http://localhost:8000";
	Review:{project_id:any, user_id:any, tradie_id:any, cleaness:any, punctuality:any, friendliness:any, review:string}={project_id:0, user_id:0, tradie_id:0, cleaness:5, punctuality:5, friendliness:5, review:""};
	Edit:any=0;
	project_status:any=3;
	constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider, public imageViewerController:ImageViewerController, public jobProvider:JobproProvider, public viewCtrl: ViewController)
	{
		this.project_id=this.navParams.get("project_id");
		this.user_id=this.navParams.get("project_user");
		this.project_status=this.navParams.get("status");
		
		
	}
	EnableEdit()
	{
		this.Edit=1;
	}
	presentToast(Message) {
		const toast = this.toastCtrl.create({
			message: Message,
			duration: 3000
		});
		toast.present();
	}
	LoadReview()
	{
		let project_id=this.navParams.get("project_id");
		this.Review.project_id=project_id;
		this.httpClient.get<any>(this.source+'/api/GetReviewByProject/'+project_id).subscribe(data => {
			//alert("test");
			if(data.Review!=null)
			{
				this.Review=data.Review;
				this.Edit=0;
			}
			else
			{
				this.Edit=1;
			}
			
		},
		err => {
				console.log(err);	
		});
	}
	SaveReview()
	{
		if(this.Review.review!="")
		{
			this.Review.project_id=this.project_id;
			this.httpClient.post<any>(this.source+'/api/SaveReview',{
				project_id:this.project_id, user_id:this.user_id,
				tradie_id:this.Review.tradie_id,
				cleaness:this.Review.cleaness,
				punctuality:this.Review.punctuality,
				friendliness:this.Review.friendliness,
				review:this.Review.review
			}).subscribe(data => {
				this.presentToast("Review saved");
				this.LoadReview();
			},
			err => {
					console.log(err);	
			});
		}
		else
		{
			this.presentToast("Review cannot be empty");
		}
	}
	LoadProgress()
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
		let project_id=this.navParams.get("project_id");
		this.httpClient.post<any>(this.source+'/api/GetProjectProgress',{
			project_id:project_id
		}).subscribe(data => {
			loader.dismiss();
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
			loader.dismiss();
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
		this.LoadReview();
	}
	presentImage(myImage) {
		const imageViewer = this.imageViewerController.create(myImage);
		imageViewer.present();
	}
	Error:string="";
	AddPhoto(s)
	{
		let addModal = this.modalCtrl.create('ItemCreatePage');
		addModal.onDidDismiss(item => {
			if (item) {
				if(s==1)
				{
					this.pre_photos.push(item.upload);
					this.pre_photos_display.push(item.upload);
					/*for(var i=0;i<item.Base64.length;i++)
					{
						this.pre_photos.push(item.Base64[i]);
						this.Review.review=item.Base64[i];
						this.pre_photos_display.push(item.Display[i]);
					}*/
				}
				else
				{
					this.post_photos.push(item.upload);
					this.post_photos_display.push(item.upload);
					/*for(var i=0;i<item.Base64.length;i++)
					{
						this.post_photos.push(item.Base64[i]);
						this.post_photos_display.push(item.Display[i]);
					}*/
				}
			}
		})
		addModal.present();
	}
	UploadPreTask()
	{
		if(this.pre_photos.length==0)
		{
			alert("Please select at least 1 photo");
		}
		else
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
			let project_id=this.navParams.get("project_id");
			this.httpClient.post<any>(this.source+'/api/SaveProjectProgress',{
				user_id:this.commonProvider.User.id,
				project_id:project_id,
				photos:this.pre_photos,
				project_status:1
			}).subscribe(data => {
				loader.dismiss();
				this.LoadProgress();
				this.pre_photos=[];
				this.pre_photos_display=[];
			},
			err => {
				loader.dismiss();
				console.log(err);	
			});
		}
	}
	UploadPostTask()
	{
		if(this.post_photos.length==0)
		{
			alert("Please select at least 1 photo");
		}
		else
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
			let project_id=this.navParams.get("project_id");
			this.httpClient.post<any>(this.source+'/api/SaveProjectProgress',{
				user_id:this.commonProvider.User.id,
				project_id:project_id,
				photos:this.post_photos,
				project_status:3
			}).subscribe(data => {
				loader.dismiss();
				this.LoadProgress();
				this.post_photos=[];
				this.post_photos_display=[];
			},
			err => {
				loader.dismiss();
				console.log(err);	
			});
		}
	}
	message:string="";
	SendMessage()
	{
		if(this.message!="" && this.message!="")
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
			let project_id=this.navParams.get("project_id");
			this.httpClient.post<any>(this.source+'/api/SaveProjectProgress',{
				user_id:this.commonProvider.User.id,
				project_id:project_id,
				message:this.message,
				project_status:2
			}).subscribe(data => {
				loader.dismiss();
				this.LoadProgress();
				this.message="";
			},
			err => {
				loader.dismiss();
				console.log(err);	
			});
		}
		else
		{
			alert("Please enter a message to send");
		}
	}
	VerifyComplete(project_status)
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
		let project_id=this.navParams.get("project_id");
		this.httpClient.post<any>(this.source+'/api/SaveProjectProgress',{
			user_id:this.commonProvider.User.id,
			project_id:project_id,
			project_status:project_status
		}).subscribe(data => {
			loader.dismiss();
			this.LoadProgress();
			if(project_status==5)
			{
				this.navCtrl.pop();
			}
		},
		err => {
			loader.dismiss();
			console.log(err);	
		});
	}
}
