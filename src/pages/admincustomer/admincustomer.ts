import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, MenuController, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-admincustomer',
  templateUrl: 'admincustomer.html',
})
export class AdmincustomerPage {
	Customers:any[]=[];
	Pagers:any[]=[];
	pager:any;
	search:{name:string,min_due:any,max_due:any}={name:"",min_due:'',max_due:''};

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient:HttpClient, public device:Device, public toastCtrl: ToastController, public platform: Platform, public commonProvider: CommondataProvider, public menuController:MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmincustomerPage');
  }
	LoadCustomers()
	{
		this.Customers=[];
		let post_data={
			name:this.search.name,
			min_due:this.search.min_due,
			max_due:this.search.max_due
		};
		this.httpClient.post<any>('https://ptezone.com.au/api/GetCustomersAdmin',post_data).subscribe(data => {
			this.Customers=data;
			if(this.Customers.length>10)
			{
				for(var i=0;i<this.Customers.length;i=i+10)
				{
					this.Pagers.push({value:String(i+1)+"-"+String(i+10), text:String(i+1)+"-"+String(i+10)});
					this.pager=String(i+1)+"-"+String(i+10);
				}
			}
			else
			{
				this.Pagers=[];
				this.pager=null;
			}
		},
		err => {
					
		});
	}
	ViewProfile(Customer)
	{
		this.navCtrl.push("CustomerprofilePage",{Customer:Customer});
	}
	ionViewDidEnter()
	{
		if(this.Customers.length>0)
		{
			this.LoadCustomers();
		}
	}
}
