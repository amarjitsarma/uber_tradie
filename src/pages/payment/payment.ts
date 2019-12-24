import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content, Platform } from 'ionic-angular';
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
import { Stripe } from '@ionic-native/stripe';
@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
	card:{account_holder:string, card_no:string, exp_month:string, exp_year:string, cvc:string}={
		account_holder:"", 
		card_no:"", 
		exp_month:"", 
		exp_year:"",
		cvc:""
	}
	card_type:string="";
	Amount:any=0;
	ProjectID:any=0;
	Projects:any[]=[];
	balance_amount:any=0.00;
	withdraw_amount:any=0.00;
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider, public imageViewerController:ImageViewerController, private stripe: Stripe)  {
	  this.Amount=this.navParams.get("amount");
	  this.ProjectID=this.navParams.get("project_id");
	  this.LoadUnpainProjects();
	  this.GetBalance();
  }
  CVC_Error:string="";
  EXP_Error:string="";
  CardType_Error:string="";
  CardNo_Error:string="";
  Payment_Error:string="";
	ValidateCVC()
	{
		this.stripe.validateCVC(this.card.cvc).then(data=>{
			this.CVC_Error=JSON.stringify(data);
		}).catch(error=>{
			this.CVC_Error=JSON.stringify(error);
		});
	}
	ValidateEXP()
	{
		this.stripe.validateExpiryDate(this.card.exp_month,this.card.exp_year).then(data=>{
			this.EXP_Error=JSON.stringify(data);
		}).catch(error=>{
			this.EXP_Error=JSON.stringify(error);
		});
	}
	GetCardType()
	{
		this.stripe.getCardType(this.card.card_no).then(data=>{
			this.card_type=data;
		}).catch(error=>{
			alert("invalid card number");
		});
	}
	ValidateCardNo()
	{
		this.stripe.getCardType(this.card.card_no).then(data=>{
			this.CardNo_Error=JSON.stringify(data);
		}).catch(error=>{
			this.CardNo_Error=JSON.stringify(error);
		});
	}
	ProcessPayment()
	{
		
		this.stripe.setPublishableKey('pk_live_lbjiCleZmliHZtQI00Iy8bk200onuFkWnG');
		let card = {
			name: this.card.account_holder,
			number: this.card.card_no,
			expMonth: parseInt(this.card.exp_month),
			expYear: parseInt(this.card.exp_year),
			cvc: this.card.cvc
		};
		this.stripe.createCardToken(card).then(data=>{
			this.Payment_Error=JSON.stringify(data);
		}).catch(error=>{
			this.Payment_Error=JSON.stringify(error);
		});
	}
	LoadUnpainProjects()
	{
		this.httpClient.get<any>(this.source+'/api/GetUnpaidJobsByCustomer/'+this.commonProvider.User.id).subscribe(data => {
			this.Projects=data;
		},
		err => {
				console.log(err);
		});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }
  TransactionHistory()
  {
	  this.navCtrl.push("TransactionhistoryPage");
  }
  WithdrawAmount()
  {
	  
  }
  Pay(project_id, amount)
  {
	  
  }
  GetBalance()
  {
	  this.httpClient.get<any>(this.source+'/api/GetLastBalance/'+this.commonProvider.User.id).subscribe(data => {
			if(data.balance==null)
			{
				this.balance_amount=0.00;
			}
			else
			{
				
				this.balance_amount=data.balance.toFixed(2);
			}
		},
		err => {
				console.log(err);
		});
  }

}
