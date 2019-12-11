import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-mybids',
  templateUrl: 'mybids.html',
})
export class MybidsPage {
	Tasks:any=[];
	DeviceID:string="";
	showall:boolean=true;
	assigned:boolean=false;
	sortby_date_asc:boolean = true;
	sortby_date_desc:boolean = false;
	sortby_price_asc:boolean = false;
	sortby_price_desc:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvier:CommondataProvider){
	  this.LoadProjects();
  }
	
	LoadProjects()
	{
		var url='https://ptezone.com.au/api/GetMyBids';
		if(this.assigned==true)
		{
			url='https://ptezone.com.au/api/GetMyTasks';
		}
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
		this.httpClient.post<any>(url,{device_id:this.commonProvier.DeviceID, sort_by:sort_by}).subscribe(data => {
			if(this.assigned)
			{
				this.Tasks=data.Tasks;
			}
			else
			{
				this.Tasks=data.Bids;
			}
		},
		err => {
				console.log(err);	
		});
	}
	GoDetail(bid, id)
	{
		this.navCtrl.push('ProjectdetailPage',{Bid:bid, ProjectID:id});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad MybidsPage');
  }
  FindJob()
	{
		this.navCtrl.push("JoblistPage");
	}
	PostedJob()
	{
		this.navCtrl.push("MypostsPage");
	}
	 Filter() {
		let alert = this.alertCtrl.create();
		alert.setTitle('Filter By!');
	
		alert.addInput({
			type: 'radio',
			label: 'Show all',
			value: 'all',
			checked: this.showall
		});
		alert.addInput({
			type: 'radio',
			label: 'Show Only Assigned',
			value: 'assigned',
			checked: this.assigned
		});
	
		alert.addButton('Cancel');
		alert.addButton({
			text: 'OK',
			handler: data => {
				if(data=='all')
				{
					this.showall=true;
					this.assigned=false;
				}
				else if(data=='assigned')
				{
					this.showall=false;
					this.assigned=true;
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

}
