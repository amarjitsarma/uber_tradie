import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, MenuController, LoadingController, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { SQLite } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { SelectSearchableComponent } from 'ionic-select-searchable';

class User {
    public user_id: number;
    public name: string;
}
@IonicPage()
@Component({
  selector: 'page-adminpayment',
  templateUrl: 'adminpayment.html',
})

export class AdminpaymentPage {
	Customer:User={user_id:0,name:"Select Customer"};
	Customers:User[]=[];
	Tradie:User={user_id:0,name:"Select Tradie"};
	Tradies:User[]=[];
	port: User;
	transaction_type:number=0;
	user_type:number=0;
	from_date:string="";
	to_date:string="";
	from_date_show:string="";
	to_date_show:string="";
	Transactions:any[]=[];
	receive:any=0;
	withdraw:any=0;
	balance:any=0;
	withdraw_amount:any;
	search_result:any=0;
	source:string="https://ptezone.com.au";//"http://localhost:8000";
	AdminWallet:{TotalRegistration:any, TotalProjectIn:any, TotalProjectOut:any}={TotalRegistration:0, TotalProjectIn:0, TotalProjectOut:0};
	AdminBalance:any=0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient:HttpClient, public device:Device, public toastCtrl: ToastController, public sqlite: SQLite, public platform: Platform, public commonProvider: CommondataProvider, public menuController:MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
	  this.LoadUsers();
	  var d1=new Date();
	  this.from_date=this.formatDate(d1);
	  this.from_date_show=this.commonProvider.GetFormattedDate(d1);
	  this.to_date=this.formatDate(d1);
	  this.to_date_show=this.commonProvider.GetFormattedDate(d1);
	  if(this.commonProvider.Role=='User')
	  {
		  this.Customer={user_id:this.commonProvider.User.id, name:this.commonProvider.User.first_name};
	  }
	  if(this.commonProvider.Role=='Tradie')
	  {
		  this.Tradie={user_id:this.commonProvider.User.id, name:this.commonProvider.tradie_basic.fullname};
	  }
	  this.Search();
  }
	LoadUsers()
	{
		this.httpClient.get<any>(this.source+'/api/GetAllUsers').subscribe(data => {
			for(var i=0;i<data.Customers.length;i++)
			{
				this.port={user_id:data.Customers[i].id, name:data.Customers[i].first_name+' '+data.Customers[i].last_name};
				this.Customers.push(this.port);	
			}
			for(var j=0;j<data.Tradies.length;j++)
			{
				this.port={user_id:data.Tradies[j].id, name:data.Tradies[j].fullname};
				this.Tradies.push(this.port);	
			}
		},
		err => {
				console.log(err);	
		});
	}
	portChange(event: {
        component: SelectSearchableComponent,
        value: any 
    }) {
    }
	ionViewDidLoad() {
		console.log('ionViewDidLoad AdminpaymentPage');
	}
	SelectFromDate()
	{
		this.OpenCalender("from_date");
	}
	SelectToDate()
	{
		this.OpenCalender("to_date");
	}
	Search()
	{	
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container" style="height:100%; width:100%;">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		setTimeout(()=>{
			this.httpClient.post<any>(this.source+'/api/GetTransactios',{
				transaction_type:this.transaction_type,
				user_type:this.user_type,
				customer:this.Customer.user_id,
				tradie:this.Tradie.user_id,
				from_date:this.from_date,
				to_date:this.to_date
			}).subscribe(data => {
				this.search_result=1;
				loader.dismiss();
				this.Transactions=data.Transactions;
				this.receive=data.received;
				this.withdraw=data.withdraw;
				this.balance=data.balance;
				
				this.AdminWallet={TotalRegistration:data.AdminWallet.TotalRegistration, TotalProjectIn:data.AdminWallet.TotalProjectIn, TotalProjectOut:data.AdminWallet.TotalProjectOut};
				this.AdminBalance=parseFloat(this.AdminWallet.TotalRegistration)+parseFloat(this.AdminWallet.TotalProjectIn)-parseFloat(this.AdminWallet.TotalProjectOut);
			},
			err => {
				loader.dismiss();
				console.log(err);	
			});
		},1000);
	}
	ModalActiv:boolean=false;
	OpenCalender(date_type)
	{
		if(this.ModalActiv==false)
		{
			this.ModalActiv=true;
			let modal = this.modalCtrl.create("DatePickerPage",{transaction:1});
	
			modal.onDidDismiss((date) => {
				this.ModalActiv=false;
				if(date)
				{
					if(date_type=="from_date")
					{
						this.from_date=this.formatDate(date);
						this.from_date_show=this.commonProvider.GetFormattedDate(date);
					}
					else if(date_type=="to_date")
					{
						this.to_date=this.formatDate(date);
						this.to_date_show=this.commonProvider.GetFormattedDate(date);
					}
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
			this.withdraw_amount= elementChecker.slice(0, -1);
		}
	}
	Withdraw()
	{
		if(this.withdraw_amount!="" && this.withdraw_amount<=this.balance)
		{
			this.httpClient.post<any>(this.source+'/api/WithdrawMoney',{id:this.commonProvider.tradie_basic.user_id, amount: this.withdraw_amount})
			.subscribe(data => {
				alert(data.message);
				this.Search();
			},
			err => {
				alert(JSON.stringify(err));
			})
		}
		else
		{
			alert("Please enter a valid amount");
		}
	}

}
