import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, MenuController, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { CommondataProvider } from '../../providers/commondata/commondata';

@IonicPage()
@Component({
  selector: 'page-admincustomer',
  templateUrl: 'admincustomer.html',
})
export class AdmincustomerPage {
	Customers:any[]=[];
	Pagers:any[]=[];
	pager:any;
	search_result:any=0;
	search:{name:string,min_due:any,max_due:any}={name:"",min_due:'',max_due:''};
	source:string="https://ptezone.com.au";//"http://localhost:8000";
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
		this.httpClient.post<any>(this.source+'/api/GetCustomersAdmin',post_data).subscribe(data => {
			this.search_result=1;
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
	keyUpCheckerMinDue(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.search.min_due= elementChecker.slice(0, -1);
		}
		this.search.min_due=this.search.min_due.replace(" ","");
	}
	keyUpCheckerMaxDue(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.search.max_due= elementChecker.slice(0, -1);
		}
		this.search.max_due=this.search.max_due.replace(" ","");
	}
}
