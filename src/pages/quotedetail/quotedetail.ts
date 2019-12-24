import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';

@IonicPage()
@Component({
  selector: 'page-quotedetail',
  templateUrl: 'quotedetail.html',
})
export class QuotedetailPage {
	DeviceID:string="";
	Quote:any={id:0,
				user_id:0,
				quote_to:0,
				title:"",
				description:"",
				skills:"",
				payment_mode:"",
				estimate_duration:"",
				status:0,
				remarks:"",
				created_at:"",
				updated_at:"",
				Sender:{id:0,
						email:"",
						first_name:"",
						last_name:"",
						dob:"",
						phone:"",
						password:"",
						username:"",
						avatar:"",
						status:1,
						permissions:"",
						last_login:"",
						created_at:"",
						updated_at:""
					},
					Receiver:{
						id:0,
						user_id:0,
						category:0,
						sub_category:0,
						fullname:"",
						location:"",
						house_no:"",
						street_name:"",
						suburb:"",
						state:"",
						code:"",
						postcode:"",
						longitude:"",
						latitude:"",
						radius:"",
						status:0,
						created_at:"",
						updated_at:""
					}
				};
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav){
	  this.LoadQuote();
  }
	LoadQuote()
	{
		this.httpClient.post<any>(this.source+'/api/GetQuote',{id:this.navParams.get("id")}).subscribe(data => {
			this.Quote=data.Quotes;
		},
		err => {
				console.log(err);	
		});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotedetailPage');
  }

}
