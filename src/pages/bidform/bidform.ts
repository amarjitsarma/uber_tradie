import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';

@IonicPage()
@Component({
  selector: 'page-bidform',
  templateUrl: 'bidform.html',
})
export class BidformPage {
  
	DeviceID:string="";
	bid_amount:string="";
	completion_time:string="";
	completion_time_show:string="";
	bid_desc:string="";
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
	Bid:any={
		charge_type:1,
		id:0,
		completion_time:'',
		completion_time_show:'',
		bid_desc:'',
		bid_amount:'',
		total_amount:'',
		hourly_rate:'',
		approx_hour:'',
		per_km_charge:'', 
		distance:'', 
		free_distance:'',
		call_out_charge:''
	};
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider) {
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		this.LoadBid();
	setTimeout(()=>{
		loader.dismiss();
		if(this.Bid.per_km_charge!="" && this.Bid.distance!=""  && this.Bid.distance!=null)
		{
			if(parseFloat(this.Bid.distance)>parseFloat(this.Bid.free_distance))
			{
				this.Bid.call_out_charge=(parseFloat(this.Bid.per_km_charge)*(parseFloat(this.Bid.distance)-parseFloat(this.Bid.free_distance))).toFixed(2);
			}
			else
			{
				this.Bid.call_out_charge=0;
			}
		}
		else
		{
			this.Bid.call_out_charge=0;
		}
	},2000);
	
  }
	LoadBid()
	{
		
		this.httpClient.post<any>('https://ptezone.com.au/api/LoadPreviousBid',
		{
			project_id:this.navParams.get("ProjectID"),
			user_id:this.commonProvider.User.id
		}).subscribe(data => {
			
			if(data.Bid!=null)
			{
				this.Bid.bid_amount=data.Bid.bid_amount;
				this.Bid.completion_time=data.Bid.completion_time;
				this.Bid.completion_time_show=this.commonProvider.GetFormattedDate(data.Bid.completion_time);
				this.Bid.bid_desc=data.Bid.bid_desc;
				this.Bid.bid_amount=data.Bid.bid_amount;
				this.Bid.total_amount=data.Bid.total_amount;
				this.Bid.hourly_rate=data.Bid.hourly_rate;
				if(this.Bid.hourly_rate!="")
				{
					this.Bid.charge_type=2;
				}
				this.Bid.approx_hour=String(data.Bid.approx_hour);
				this.Bid.per_km_charge=data.Bid.per_km_charge;
				this.Bid.distance=data.Bid.distance;
				this.Bid.free_distance=data.Bid.free_distance;
				this.Bid.call_out_charge=data.Bid.call_out_charge;
			}
			else
			{
				this.Bid.hourly_rate=this.commonProvider.tradie_basic.per_hour_charge;
				this.Bid.per_km_charge=this.commonProvider.tradie_basic.call_out_charge;
				this.Bid.distance=this.navParams.get("distance");
				this.Bid.free_distance=this.commonProvider.tradie_basic.radius;
			}
			this.CalculateBid();
		},
		err => {
			console.log(err);	
		});
	}
	PlaceBid()
	{
		let ProjectID=this.navParams.get("ProjectID");
		if(this.Bid.bid_amount!="" && this.Bid.completion_time!="" && this.Bid.bid_desc!="")
		{
			let postData={
				device_id:this.commonProvider.DeviceID,
				project_id:ProjectID,
				id:this.Bid.id,
				completion_time:this.Bid.completion_time,
				bid_desc:this.Bid.bid_desc,
				bid_amount: this.Bid.bid_amount,
				total_amount: this.Bid.total_amount,
				hourly_rate: this.Bid.hourly_rate,
				approx_hour: this.Bid.approx_hour,
				per_km_charge: this.Bid.per_km_charge,
				distance: this.Bid.distance,
				free_distance: this.Bid.free_distance,
				call_out_charge: this.Bid.call_out_charge
				
			}
			let loader:any = this.loadingCtrl.create({
			spinner: "hide",
			content: `<div class="custom-spinner-container">
							<div class="custom-spinner-box">
								<img src="assets/img/spinner.gif" width="100%"/>
							</div>
						</div>`
			});
			loader.present();
			
			this.httpClient.post<any>('https://ptezone.com.au/api/SaveBid',postData).subscribe(data => {
				loader.dismiss();
				this.ShowAlert("Success","Your bid is submitted");
				this.navCtrl.setRoot('MytasksPage');
			},
			err => {
				loader.dismiss();
				console.log(err);	
			});
		}
		else
		{
			this.ShowAlert("Error", "Please fill up all the fields");
		}
	}
	ChangeChargeType()
	{
		this.Bid.total_amount="";
		this.Bid.hourly_rate=this.commonProvider.tradie_basic.per_hour_charge;
		this.Bid.bid_amount="";
		this.CalculateBid();
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad BidformPage');
  }
	ModalActiv:boolean=false;
	OpenCalender()
	{
		if(this.ModalActiv==false)
		{
			this.ModalActiv=true;
			let modal = this.modalCtrl.create("DatePickerPage");
	
			modal.onDidDismiss((date) => {
				this.ModalActiv=false;
				if(date)
				{
					this.Bid.completion_time=this.formatDate(date);
					this.Bid.completion_time_show=this.commonProvider.GetFormattedDate(date);
				}
			});
	
			modal.present();
		}			
	}
	formatDate(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
	
		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
	
		return [year, month, day].join('-');
	}
	keyUpChecker(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.Bid.bid_amount= elementChecker.slice(0, -1);
		}
		this.Bid.bid_amount=String(this.Bid.bid_amount).replace(" ","");
	}
	keyUpCheckerFTK(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.Bid.total_amount= elementChecker.slice(0, -1);
		}
		this.CalculateBid();
	}
	keyUpCheckerPKC(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.Bid.per_km_charge= elementChecker.slice(0, -1);
		}
		this.Bid.per_km_charge=String(this.Bid.per_km_charge).replace(" ","");
		this.CalculateBid();
	}
	keyUpCheckerFTD(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.Bid.free_distance= elementChecker.slice(0, -1);
		}
		this.Bid.free_distance=String(this.Bid.free_distance).replace(" ","");
		this.CalculateBid();
	}
	keyUpCheckerPHC(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.Bid.hourly_rate= elementChecker.slice(0, -1);
		}
		this.Bid.hourly_rate=String(this.Bid.hourly_rate).replace(" ","");
		this.CalculateBid();
	}
	keyUpCheckerAH(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.Bid.per_hour_charge= elementChecker.slice(0, -1);
		}
		this.Bid.approx_hour=String(this.Bid.approx_hour).replace(" ","");
		this.CalculateBid();
	}
	CalculateBid(){
		
		if(this.Bid.charge_type==1)
		{
			if(this.Bid.total_amount!="")
			{
				if(this.Bid.call_out_charge=="")
				{
					this.Bid.bid_amount=this.Bid.total_amount;
				}
				else
				{
					this.Bid.bid_amount=parseFloat(this.Bid.total_amount)+parseFloat(this.Bid.call_out_charge);
				}
			}
			else
			{
				this.Bid.bid_amount="";
			}
		}
		else
		{
			if(this.Bid.hourly_rate!="" && this.Bid.approx_hour!="")
			{
				if(this.Bid.call_out_charge=="")
				{
					this.Bid.bid_amount=parseFloat(this.Bid.hourly_rate)*parseFloat(this.Bid.approx_hour);
				}
				else
				{
					this.Bid.bid_amount=parseFloat(this.Bid.hourly_rate)*parseFloat(this.Bid.approx_hour)+parseFloat(this.Bid.call_out_charge);
				}
			}
			else
			{
				this.Bid.bid_amount="";
			}
		}
	}
}
