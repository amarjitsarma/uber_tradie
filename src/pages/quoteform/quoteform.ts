import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchPage } from './../search/search';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';

@IonicPage()
@Component({
  selector: 'page-quoteform',
  templateUrl: 'quoteform.html',
})
export class QuoteformPage {
	title:string="";
	description:string="";
	skills:string="";
	payment_mode:string="";
	estimate_duration:string="";
	DeviceID:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav){
	  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuoteformPage');
  }
	RequestQuote()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		if(this.title!="" && this.description!="" && this.payment_mode!="" && this.estimate_duration!="")
		{
			let PostData={
						device_id:this.DeviceID,
						quote_to:this.navParams.get("id"),
						title:this.title,
						description:this.description,
						skills:this.skills,
						payment_mode:this.payment_mode,
						estimate_duration:this.estimate_duration
					};
			this.httpClient.post<any>('http://uber.ptezone.com.au/api/SaveQuote',PostData).subscribe(data => {
				alert("Quote Sent!");
				this.navCtrl.pop();
			},
			err => {
					console.log(err);	
			});
		}
		else
		{
			alert("Please fill all data");
		}
	}
}
