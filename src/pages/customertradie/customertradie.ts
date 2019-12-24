import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, MenuController, LoadingController, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { LocationSelect } from '../location-select/location-select';
import { MyApp } from '../../app/app.component';
import { TradiebasicPage } from '../tradiebasic/tradiebasic';
import { TradieadvancePage } from '../tradieadvance/tradieadvance';
import { IonicSelectableComponent } from 'ionic-selectable';

class PortJT {
    public ID: number;
	public CategoryID: number;
    public Name: string;
}
@IonicPage()
@Component({
  selector: 'page-customertradie',
  templateUrl: 'customertradie.html',
})
export class CustomertradiePage {
	DeviceID:string="";
	Error:string="";
	Categories:PortJT[]=[];
	SubCategories:PortJT[]=[];
	port:PortJT;
	category:PortJT;
	sub_category:PortJT[]=[];
	fullname:string="";
	ABN:string="";
	location:string="";
	house_no:string="";
	street_name:string="";
	suburb:string="";
	state:string="";
	code:string="";
	postcode:string="";
	longitude:any=0;
	latitude:any=0;
	radius:string="";
	phone:string="";
	
	basic_id:any=0;
	
	//Contact
	fl_basic_id:number=0;
	mobile:string="";
	email:string="";
	website:string="";
	contact_name:string="";
	
	//About
	short_desc:string="";
	about:string="";
	
	//Services
	services:string="";
	source:string="https://ptezone.com.au";//"http://localhost:8000";

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient:HttpClient, public device:Device, public toastCtrl: ToastController, public sqlite: SQLite, public platform: Platform, public commonProvider: CommondataProvider, public menuController:MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
	  this.LoadSubCategories();
  }
	ModalActive:boolean=false;
    launchLocationPage(){
		if(this.ModalActive==false)
		{
			this.ModalActive=true;
			let modal = this.modalCtrl.create(LocationSelect);
	
			modal.onDidDismiss((location) => {
				this.ModalActive=false;
				if(location)
				{
				this.location=location.location;
				this.street_name=location.street_name;
				this.state=location.state;
				this.code=location.code;
				this.postcode=location.postcode;
				this.longitude=location.longitude;
				this.latitude=location.latitude;
				}
			});
	
			modal.present();
		}		

    }
	keyUpChecker(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker) && elementChecker!="+") {
			this.phone= elementChecker.slice(0, -1);
		}
		this.phone=this.phone.replace(" ","");
	}
	ValidateEmail(email_id)
	{
		var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if(!re.test(email_id)) {
			return false;
		}
		else
		{
			return true;
		}
	}
	presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }
	ValidateContact(phone)
	{
		if(phone!="")
		{
			var re = /^(((([\+]61[1-9]{0,1}|([\(]{0,1}0[\)]{0,1}[1-9]{1}|[\(]{0,1}0[1-9]{1}[\)]{0,1})))([0-9]{8}|([\\s*]|[\-]{1})[0-9]{3}([\\s*]|[\-]{1})[0-9]{3}([\\s*]|[\-]{1})[0-9]{3}|(([\\s*]|[\-]{0,1})[0-9]{4}([\\s*]|[\-]{0,1})[0-9]{4})))|((1([\\s*]|[\-]{0,1})((300|800|900|902)|3[0-9]{2}))([\\s*]|[\-]{0,1})([0-9]{3}([\\s*]|[\-]{0,1})[0-9]{3}|[0-9]{6}))|((13[0-9]{1}([\\s*]|[\-]){0,1}[0-9]{3}|13([\\s*]|[\-]){1}[0-9]{2}([\\s*]|[\-]){1}[0-9]{2})))$/;
			if(!re.test(phone)) {
				return false;
			}
			else
			{
				return true;
			}
		}
		else
		{
			return true;
		}
	}
	LoadCategories()
	{
		this.httpClient.get<any>(this.source+'/api/GetCategories').subscribe(data => {
			for(var i=0;i<data.Categories.length;i++)
			{
				this.port={ID:data.Categories[i].ID, CategoryID:0, Name:data.Categories[i].CategoryName};
				this.Categories.push(this.port);	
			}
			console.log(this.Categories);
		},
		err => {
				console.log(err);	
		});
	}
	LoadSubCategories()
	{
		this.httpClient.post<any>(this.source+'/api/GetSubCategories',{ID:0/*this.category.ID*/}).subscribe(data => {
			this.SubCategories=[];
			
			for(var i=0;i<data.SubCategories.length;i++)
			{
				this.port={ID: data.SubCategories[i].ID, CategoryID: data.SubCategories[i].CategoryID,Name:data.SubCategories[i].SubCategoryName};
				this.SubCategories.push(this.port);
			}
		},
		err => {
					
		});
	}
	SaveBasic()
	{
		if(this.sub_category.length==0)
		{
			this.presentToast("Please select a sub category");
			return false;
		}
		if(this.fullname=="")
		{
			this.presentToast("Please enter your business name");
			return false;
		}
		if(this.phone=="")
		{
			this.presentToast("Please enter your Phone number");
			return false;
		}
		if(this.ValidateContact(this.phone)==false)
		{
			this.presentToast("Please enter a valid Phone number");
			return false;
		}
		if(this.location=="")
		{
			this.presentToast("Please enter a location");
			return false;
		}
		if(this.about=="")
		{
			this.presentToast("Please enter about detail of your business");
			return false;
		}
		
		
		if(this.sub_category.length!=0 && this.fullname!="" && this.location!="" && this.about!="")
		{
			let loader:any = this.loadingCtrl.create({
			spinner: "hide",
			content: `<div class="custom-spinner-container">
							<div class="custom-spinner-box">
								<img src="assets/img/spinner.gif" width="100%"/>
							</div>
						</div>`
			});
			loader.present();
			this.httpClient.post<any>(this.source+'/api/JoinAsTradie',
			{
				device_id:this.commonProvider.DeviceID,
				sub_category:this.sub_category,
				fullname:this.fullname,
				ABN:this.ABN,
				location:this.location,
				house_no:this.house_no,
				street_name:this.street_name,
				suburb:this.suburb,
				state:this.state,
				code:this.code,
				postcode:this.postcode,
				longitude:this.longitude,
				latitude:this.latitude,
				radius:this.radius,
				phone:this.phone,
				mobile:this.mobile,
				website:this.website,
				contact_name:this.contact_name,
				short_desc:this.short_desc,
				about:this.about,
				services:this.services
			}).subscribe(data => {
				this.presentToast(data.Message);
				if(data.Error==0)
				{
					this.commonProvider.LoadBasic();
					this.commonProvider.LoadContact();
					this.commonProvider.LoadAbout();
					this.commonProvider.GetLoginDetails(this.commonProvider.DeviceID);
					setTimeout(()=>{
						this.navCtrl.setRoot("TradiehomePage");
						loader.dismiss();
					},3000);
				}
				else
				{
					loader.dismiss();
				}
			},
			err => {
					loader.dismiss();
					this.Error=JSON.stringify(err);
			});
		}
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomertradiePage');
  }

}
