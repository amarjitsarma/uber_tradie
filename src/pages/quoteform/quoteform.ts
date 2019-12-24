import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';

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
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public sqlite: SQLite, public commonProvider:CommondataProvider){
	  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuoteformPage');
  }
	
	RequestQuote()
	{
		if(this.title!="" && this.description!="" && this.payment_mode!="" && this.estimate_duration!="")
		{
			let PostData={
						device_id:this.commonProvider.DeviceID,
						quote_to:this.navParams.get("id"),
						title:this.title,
						description:this.description,
						skills:this.skills,
						payment_mode:this.payment_mode,
						estimate_duration:this.estimate_duration
					};
			this.httpClient.post<any>(this.source+'/api/SaveQuote',PostData).subscribe(data => {
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
