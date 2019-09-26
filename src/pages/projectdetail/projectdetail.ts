import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
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
						}
					};
	Mine:any=0;
	Bids_Enabled=0;
	My_Task=0;
	Bids:any=[];
	DeviceID:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device) {
	this.LoadProjects();
	this.LoadBids();
  }
	LoadProjects()
	{
		let ProjectID = this.navParams.get('ProjectID');
		if(this.navParams.get('Mine')==1)
		{
			this.Mine=1;
		}
		if(this.navParams.get('Task')==1)
		{
			this.My_Task=1;
		}
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetProjects',{ProjectID:ProjectID}).subscribe(data => {
			this.Project=data.Projects;
			
		},
		err => {
				console.log(err);	
		});
	}
	LoadBids()
	{
		let ProjectID = this.navParams.get('ProjectID');
		if(this.navParams.get('Bids')==1)
		{
			this.Bids_Enabled=1;
			this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetProjectBids',{ProjectID:ProjectID}).subscribe(data => {
				this.Bids=data.Bids;
			},
			err => {
				console.log(err);	
			});
		}
		else
		{
			this.Bids_Enabled=0;
		}
	}
	BidNow(id)
	{
		this.navCtrl.push('BidformPage',{ProjectID:id});
	}
	ViewTradie(id)
	{
		this.navCtrl.push('ItemDetailPage',{id:id});
	}
	ApproveBid(BidID)
	{
		var scope=this;
		let alert = this.alertCtrl.create({
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
					this.httpClient.post<any>('http://uber.ptezone.com.au/api/ApproveBid',{bid_id:BidID}).subscribe(data => {
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
	MarkFinished(ProjectID)
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
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
					this.httpClient.post<any>('http://uber.ptezone.com.au/api/ChangeProjectStatus',{project_id:ProjectID,status:3,device_id:this.DeviceID}).subscribe(data => {
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
	MarkIncomplete(ProjectID)
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
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
					this.httpClient.post<any>('http://uber.ptezone.com.au/api/ChangeProjectStatus',{project_id:ProjectID,status:2,device_id:this.DeviceID}).subscribe(data => {
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
	
}
