import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';

@IonicPage()
@Component({
  selector: 'page-quotelist',
  templateUrl: 'quotelist.html',
})
export class QuotelistPage {
	DeviceID:string="";
	Quotes:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav) {
	  this.LoadQuotes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotelistPage');
  }
	LoadQuotes()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		let type=this.navParams.get("type");
		let PostData=null;
		if(type=="receiver")
		{
			PostData={
				type:"receiver",
				device_id:this.DeviceID
			};
			
		}
		else
		{
			PostData={
				type:"sender",
				device_id:this.DeviceID
			};
		}
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetQuote',PostData).subscribe(data => {
			this.Quotes=data.Quotes;
		},
		err => {
				console.log(err);	
		});
	}
	ViewQuote(id)
	{
		this.navCtrl.push('QuotedetailPage',{id:id});
	}
}
