import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-bidlist',
  templateUrl: 'bidlist.html',
})
export class BidlistPage {
	Bids:any=[];
	DeviceID:string="";
	
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public sqlite: SQLite) {
	  this.LoadBids();
  }
	LoadBids()
	{
		this.platform.ready().then(() => {
			this.sqlite.create({
				name: 'data.db',
				location: 'default'
			}).then((db : SQLiteObject)=>{
				db.executeSql("select * from device_id", []).then(data=>{
					this.LoadBidsFinal(data.rows.item(0).id);
				}).catch(e=>console.log(e));
			}).catch(e=>console.log(e));
		});
	}
	LoadBidsFinal(DeviceID)
	{
		let PostData={	
			type:"sender",	
			device_id:DeviceID
		};
		this.httpClient.post<any>('https://ptezone.com.au/api/GetBids',PostData).subscribe(data => {
			this.Bids=data.Bids;
		},
		err => {
				console.log(err);	
		});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad BidlistPage');
  }

}
