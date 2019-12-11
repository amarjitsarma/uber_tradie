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
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-projectdetail',
  templateUrl: 'projectdetail.html',
})
export class ProjectdetailPage {
	Project:any={
						id:0,
						user_id:0,
						category:0,
						sub_category:0,
						location_type:"onsite",
						title:"",
						description:"",
						skills:"",
						payment_mode:"",
						estimate_budget:0,
						working_hour:0,
						status:0,
						completed_by:null,
						rating:null,
						feedback:null,
						created_at:"",
						updated_at:"",
						Address:
						{
							id:0,
							project_id:0,
							location:null,
							longitude:null,
							latitude:null,
							radius:null,
							house_no:"",
							street_name:"",
							suberb:"",
							state:"",
							code:"",
							created_at:"",
							updated_at:""
						},
						User:
						{
							id:0,
							email:"",
							first_name:"",
							last_name:"",
							dob:"",
							phone:"",
							password:"",
							username:"",
							avatar:null,
							status:0,
							permissions:null,
							last_login:"",
							created_at:"",
							updated_at:""
						},
						Category:
						{
							ID:0,
							CategoryName:"",
							description:"",
							cover_photo:"",
							thumbnail:"",
							status:1,
							created_at:"",
							updated_at:""
						},
						SubCategory:
						{
							ID:0,
							CategoryID:0,
							SubCategoryName:"",
							Icon:"",
							cover_photo:"",
							short_desc:"",
							description:"",
							created_at:"",
							updated_at:""
						},
						Files:[]
					};
	Mine:any=0;
	Bids_Enabled=0;
	My_Task=0;
	Bids:any[]=[];
	DeviceID:string="";
	Edit:any=0;
	Review:any={project_id:0, user_id:0, tradie_id:0, cleaness:0, punctuality:0, friendliness:0, review:""};
	comment:string="";
	comment_photos:string[]=[];
	comments:any=[];
	distance:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider, public imageViewerController:ImageViewerController, public jobProvider:JobproProvider, public viewCtrl: ViewController) {
	/*this.LoadProjects();
	this.LoadBids();
	this.LoadReview();*/
  }
	
  presentImage(myImage) {
    const imageViewer = this.imageViewerController.create(myImage);
    imageViewer.present();
  }
	logRatingChangeC(rating){
        this.Review.cleaness=rating;
    }
	logRatingChangeP(rating){
        this.Review.punctuality=rating;
    }
	logRatingChangeF(rating){
        this.Review.friendliness=rating;
    }
	EditJob(project_id)
	{
		this.navCtrl.push(JobpostPage,{project_id:project_id});
	}
	ModalActive:boolean=false;
	ViewMoreBids()
	{
		if(this.ModalActive==false)
		{
			this.ModalActive=true;
			let modal = this.modalCtrl.create("EditjobPage",{project_id:this.Project.id});
	
			modal.onDidDismiss((data) => {
				this.ModalActive=false;
				this.LoadProjects();
				
			});
	
			modal.present();
		}
	}
	Bidded:any=0;
	MyBid:any=null;
	GetMyBid()
	{
		for(let i=0;i<this.Bids.length;i++)
		{
			if(this.Bids[i].user_id==this.commonProvider.User.id)
			{
				this.Bidded=1;
				this.MyBid=this.Bids[i];
				break;
			}
		}
	}
	LoadReview()
	{
		this.httpClient.get<any>('https://ptezone.com.au/api/GetReviewByProject/'+this.navParams.get('ProjectID')).subscribe(data => {
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
			this.Review.project_id=this.Project.id;
			this.httpClient.post<any>('https://ptezone.com.au/api/SaveReview',this.Review).subscribe(data => {
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
	presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }
	LoadProjects()
	{
		let scope=this;
		
		let ProjectID = this.navParams.get('ProjectID');
		if(this.navParams.get('Mine')==1)
		{
			this.Mine=1;
		}
		if(this.navParams.get('Task')==1)
		{
			this.My_Task=1;
		}
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container" style="bordoer-radius:100px;">
								<div class="custom-spinner-box">
									<img src="assets/img/spinner.gif" width="100%"/>
								</div>
							</div>`
		});
		loader.present();
		this.httpClient.post<any>('https://ptezone.com.au/api/GetProjects',{ProjectID:ProjectID}).subscribe(data => {
			loader.dismiss();
			this.Project=data.Projects;
			this.comments=this.Project.Comments;
			this.LoadBids();
			this.LoadReview();
			if(this.Project.Address!=null)
			{
				try
				{
					var service = new google.maps.DistanceMatrixService();
					var origin1 = new google.maps.LatLng(this.Project.Address.latitude, this.Project.Address.longitude);
					var destinationB = new google.maps.LatLng(this.jobProvider.location.latitude,this.jobProvider.location.longitude);
		
					service.getDistanceMatrix(
					{
						origins: [origin1],
						destinations: [destinationB],
						travelMode: 'DRIVING',
					}, (response, status)=>{
						try
						{
							scope.distance=response.rows[0].elements[0].distance.text;
							scope.distance=scope.distance.substr(0,scope.distance.length-3);
						}
						catch(ex)
						{
							
						}
					});
				}
				catch(ex){
					
				}
			}
		},
		err => {
				console.log(err);
				loader.dismiss();				
				this.Error=JSON.stringify(err);
		});
	}
	LoadBids()
	{
		let ProjectID = this.navParams.get('ProjectID');
		this.httpClient.post<any>('https://ptezone.com.au/api/GetProjectBids',{ProjectID:ProjectID}).subscribe(data => {
			this.Bids=data.Bids;
			if(this.Bids.length>0)
			{
				this.GetMyBid();
			}
		},
		err => {
			console.log(err);	
		});
		if(this.navParams.get('Bids')==1)
		{
			this.Bids_Enabled=1;	
		}
		else
		{
			this.Bids_Enabled=0;
		}
	}
	BidNow(id)
	{
		this.navCtrl.push('BidformPage',{ProjectID:id, distance:this.distance});
	}
	ViewTradie(id)
	{
		this.navCtrl.push('ItemDetailPage',{id:id});
	}
	ApproveBid(BidID)
	{
		//this.Error=BidID;
		var scope=this;
		let alert = scope.alertCtrl.create({
			title: 'Confirm selection',
			message: 'Do you want to approve this bid?',
			buttons: [
			{
				text: 'Cancel',
				role: 'cancel',
				handler: () => {
				console.log('Cancel clicked');
				}
			},
			{
				text: 'Approve',
				handler: () => {
					scope.httpClient.post<any>('https://ptezone.com.au/api/ApproveBid',{bid_id:BidID}).subscribe(data => {
						scope.LoadProjects();
						scope.LoadBids();
					},
					err => {
						scope.Error=JSON.stringify(err);
					});
				}
			}
			]
		});
		alert.present();
	}
	
	
	MarkFinished(ProjectID)
	{
		var scope=this;
		let alert = this.alertCtrl.create({
			title: 'Confirm selection',
			message: 'Do you want to Mark this complete?',
			buttons: [
			{
				text: 'Cancel',
				role: 'cancel',
				handler: () => {
				console.log('Cancel clicked');
				}
			},
			{
				text: 'Ok',
				handler: () => {
					this.httpClient.post<any>('https://ptezone.com.au/api/ChangeProjectStatus',{project_id:ProjectID,status:3,device_id:this.commonProvider.DeviceID}).subscribe(data => {
						this.LoadProjects();
						this.LoadBids();
					},
					err => {
						console.log(err);	
					});
				}
			}
			]
		});
		alert.present();
	}
	EnableEdit()
	{
		this.Edit=1;
	}
	MarkIncompleteFinal(ProjectID)
	{
		var scope=this;
		let alert = this.alertCtrl.create({
			title: 'Confirm selection',
			message: 'Do you want to Mark this incomplete?',
			buttons: [
			{
				text: 'Cancel',
				role: 'cancel',
				handler: () => {
				console.log('Cancel clicked');
				}
			},
			{
				text: 'Ok',
				handler: () => {
					this.httpClient.post<any>('https://ptezone.com.au/api/ChangeProjectStatus',{project_id:ProjectID,status:2,device_id:this.commonProvider.DeviceID}).subscribe(data => {
						this.LoadProjects();
						this.LoadBids();
					},
					err => {
						console.log(err);	
					});
				}
			}
			]
		});
		alert.present();
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectdetailPage');
  }
	AddPhoto()
	{
		let addModal = this.modalCtrl.create('ItemCreatePage',{avatar:1});
		addModal.onDidDismiss(item => {
			if (item) {
				this.comment_photos.push(item.upload);
			}
		})
		addModal.present();
	}
	Error:string="";
	PlaceComment()
	{
		var posted_data={project_id:this.Project.id,message:this.comment,photos:this.comment_photos,tradie_id:this.commonProvider.tradie_basic.id};
		if(this.Project.User.id==this.commonProvider.User.id)
		{
			posted_data.tradie_id=0;
		}
		this.httpClient.post<any>('https://ptezone.com.au/api/SaveProjectComment',posted_data).subscribe(data => {
			this.LoadProjects();
			this.presentToast("Comment posted");
			this.comment="";
		},
		err => {
			this.Error=JSON.stringify(err);
		});
	}
	reply_comment_id:any=0;
	reply_comment:string="";
	reply_comment_photos:string[]=[];
	Reply(comment_id)
	{
		this.reply_comment_id=comment_id;
		this.reply_comment="";
		this.reply_comment_photos=[];
	}
	CloseReply()
	{
		this.reply_comment_id=0;
	}
	AddReplyPhoto()
	{
		let addModal = this.modalCtrl.create('ItemCreatePage',{avatar:1});
		addModal.onDidDismiss(item => {
			if (item) {
				this.reply_comment_photos.push(item.upload);
			}
		})
		addModal.present();
	}
	PlaceReplyComment()
	{
		var posted_data={project_id:this.Project.id, comment_id:this.reply_comment_id, message:this.reply_comment, photos:this.reply_comment_photos, tradie_id:this.commonProvider.tradie_basic.id};
		if(this.Project.User.id==this.commonProvider.User.id)
		{
			posted_data.tradie_id=0;
		}
		this.httpClient.post<any>('https://ptezone.com.au/api/SaveProjectComment',posted_data).subscribe(data => {
			this.LoadProjects();
			this.presentToast("Replied");
			this.reply_comment="";
		},
		err => {
			this.Error=JSON.stringify(err);
		});
	}
	handler:any;
	ProcessPayment()
	{
		this.handlerOpen();
		/*this.httpClient.post<any>('https://ptezone.com.au/api/SaveTransaction',{
			project_id:this.Project.id,
			amount:this.Bids[0].bid_amount 	
		}).subscribe(data => {
			this.LoadProjects();
		},
		err => {
				console.log(err);	
		});*/
		//this.navCtrl.push("PaymentPage",{project_id: this.Project.id, amount:this.Bids[0].bid_amount});
	}
	ionViewDidEnter()
	{
		this.LoadProjects();
		this.LoadBids();
		this.LoadReview();
		let scope=this;
		setTimeout(() => {
			this.handler =  StripeCheckout.configure({
				key: 'pk_test_Hz0utMw4W2scWTYi1Q6M4Czs00DXcuAZ2W',
				image: 'https://stripe.com/img/documentation/checkout/marketplace.png', // Picture you want to show in pop up
				locale: 'auto',
				token: token => {
					scope.httpClient.post<any>('https://ptezone.com.au/api/SaveTransaction',{
						project_id:scope.Project.id,
						amount:scope.Bids[0].bid_amount ,
						token: token.id
					}).subscribe(data => {
						alert(data.message);
						if(data.error==0)
						{
							scope.LoadProjects();
						}
					},
					err => {
							console.log(err);	
					});
				}
			})
		}, 1000);
	}
	handlerOpen(){
		this.handler.open({
			name: "Payment for project #"+this.Project.id, // Pass your application name
			amount: this.Bids[0].bid_amount*100,
			currency: 'aud',			// Pass your billing amount
		});
	}
	ProjectProgress(id,user_id)
	{
		this.navCtrl.push("ProgressPage",{project_id:id,project_user:user_id});
	}
}
