import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { JobpostPage } from '../jobpost/jobpost';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-myposts',
  templateUrl: 'myposts.html',
})
export class MypostsPage {
	Projects:any=[];
	DeviceID:string="";
	s_all:boolean=true;
	s_open:boolean=false;
	s_assigned:boolean=false;
	s_complete:boolean=false;
	s_cancel:boolean=false;
	sortby_date_asc:boolean=true;
	sortby_date_desc:boolean=false;
	sortby_price_asc:boolean=false;
	sortby_price_desc:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvier:CommondataProvider) {
		this.LoadProjects();
	  }
  
  
	LoadProjects()
	{
		
		var sort_by=0;
		if(this.sortby_date_asc)
		{
			sort_by=1;
		}
		else if(this.sortby_date_desc)
		{
			sort_by=2;
		} 
		else if(this.sortby_price_asc)
		{
			sort_by=3;
		} 
		else if(this.sortby_price_desc)
		{
			sort_by=4;
		} 
		var status=0;
		if(this.s_all)
		{
			status=0;
		}
		else if(this.s_open)
		{
			status=1;
		}
		else if(this.s_assigned)
		{
			status=2;
		}
		else if(this.s_complete)
		{
			status=3;
		}
		else if(this.s_cancel)
		{
			status=4;
		}
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container" style="height:100%; width:100%;">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		this.httpClient.post<any>('https://ptezone.com.au/api/GetMyPosts',{device_id:this.commonProvier.DeviceID, sort_by:sort_by, status:status}).subscribe(data => {
			this.Projects=data.Projects;
			loader.dismiss();
		},
		err => {
			console.log(err);
			loader.dismiss();
		});
	}
	GoDetail(id)
	{
		this.navCtrl.push('ProjectdetailPage',{ProjectID:id, Mine: 1, Bids:1});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad MypostsPage');
  }
  MyTasks()
  {
	  this.navCtrl.pop();
	  //this.navCtrl.push("MytasksPage");
  }
  PostJob()
  {
	  this.navCtrl.push(JobpostPage);
  }
  Filter() {
		let alert = this.alertCtrl.create();
		alert.setTitle('Filter By Status!');
	
		alert.addInput({
			type: 'radio',
			label: 'All',
			value: 'all',
			checked: this.s_all
		});
		alert.addInput({
			type: 'radio',
			label: 'Open',
			value: 'open',
			checked: this.s_open
		});
		alert.addInput({
			type: 'radio',
			label: 'Assigned & Closed',
			value: 'assigned',
			checked: this.s_assigned
		});
		alert.addInput({
			type: 'radio',
			label: 'Completed & Closed',
			value: 'complete',
			checked: this.s_complete
		});
		alert.addInput({
			type: 'radio',
			label: 'Canceled & Closed',
			value: 'cancel',
			checked: this.s_cancel
		});
	
		alert.addButton('Cancel');
		alert.addButton({
			text: 'OK',
			handler: data => {
				if(data=='all')
				{
					this.s_all=true;
					this.s_open=false;
					this.s_assigned=false;
					this.s_complete=false;
					this.s_cancel=false;
				}
				else if(data=='open')
				{
					this.s_all=false;
					this.s_open=true;
					this.s_assigned=false;
					this.s_complete=false;
					this.s_cancel=false;
				}
				else if(data=='assigned')
				{
					this.s_all=false;
					this.s_open=false;
					this.s_assigned=true;
					this.s_complete=false;
					this.s_cancel=false;
				}
				else if(data=='complete')
				{
					this.s_all=false;
					this.s_open=false;
					this.s_assigned=false;
					this.s_complete=true;
					this.s_cancel=false;
				}
				else if(data=='cancel')
				{
					this.s_all=false;
					this.s_open=false;
					this.s_assigned=false;
					this.s_complete=false;
					this.s_cancel=true;
				}
				this.LoadProjects();
			}
		});
		alert.present();
	}
	Sort() {
		let alert = this.alertCtrl.create();
		alert.setTitle('Sort By!');
	
		alert.addInput({
			type: 'radio',
			label: 'Posted Date | Ascending',
			value: '1',
			checked: this.sortby_date_asc
		});
		alert.addInput({
			type: 'radio',
			label: 'Posted Date | Descending',
			value: '2',
			checked: this.sortby_date_desc
		});
		alert.addInput({
			type: 'radio',
			label: 'Price | Ascending',
			value: '3',
			checked: this.sortby_price_asc
		});
		alert.addInput({
			type: 'radio',
			label: 'Price | Descending',
			value: '4',
			checked: this.sortby_price_desc
		});
	
		alert.addButton('Cancel');
		alert.addButton({
			text: 'OK',
			handler: data => {
				if(data=='1')
				{
					this.sortby_date_asc=true;
					this.sortby_date_desc=false;
					this.sortby_price_asc=false;
					this.sortby_price_desc=false;
				}
				else if(data==2)
				{
					this.sortby_date_asc=false;
					this.sortby_date_desc=true;
					this.sortby_price_asc=false;
					this.sortby_price_desc=false;
				}
				else if(data==3)
				{
					this.sortby_date_asc=false;
					this.sortby_date_desc=false;
					this.sortby_price_asc=true;
					this.sortby_price_desc=false;
				}
				else if(data==4)
				{
					this.sortby_date_asc=false;
					this.sortby_date_desc=false;
					this.sortby_price_asc=false;
					this.sortby_price_desc=true;
				}
				this.LoadProjects();
			}
		});
		alert.present();
	}
	ProcessPayment(id,amount)
	{
		this.httpClient.post<any>('https://ptezone.com.au/api/SaveTransaction',{
			project_id:id,
			amount:amount 	
		}).subscribe(data => {
			this.LoadProjects();
		},
		err => {
				console.log(err);	
		});
	}
}
