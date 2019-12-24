import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Platform, IonicPage, NavController, NavParams, ToastController, MenuController, ModalController, LoadingController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { HttpClient } from '@angular/common/http';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { LocationSelect } from '../location-select/location-select';
import { IonicSelectableComponent } from 'ionic-selectable';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';

class Port1 {
    public ID: number;
	public CategoryID: number;
    public Name: string;
}
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  Categories:Port1[]=[];
	SubCategories:Port1[]=[];
	port:Port1;
	category:Port1={ID: 0, CategoryID: 0, Name: 'Select a category'};
	sub_category:Port1[]=[];//{ID: 0, Name: 'Select a sub category'};
  account: { firstname: string, lastname: string, phone: string, email: string, username: string, password: string,con_password:string, Terms:boolean, location:string,street_name:string,suburb:string,state:string,code:string,postcode:string,longitude:string,latitude:string, fullname: string, radius: any, call_out_charge: any, per_hour_charge:any } = {
    firstname: '',
	lastname: '',
	phone: '',
    email: '',
	username: '',
    password: '',
	con_password:'',
	Terms:false,
	location:'',
	street_name:'',
	suburb:'',
	state:'',
	code:'',
	postcode:'',
	longitude:'',
	latitude:'',
	fullname:'',
	radius:'',
	call_out_charge:'',
	per_hour_charge:''
  };
	login_type:any=1;
	DeviceID:string="";
	Error:string="No error";
  // Our translated text strings
  private signupErrorString: string;
  source:string="https://ptezone.com.au";//"http://localhost:8000";

  constructor(public navCtrl: NavController,
	public navParams: NavParams,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
	public device:Device,
	public httpClient:HttpClient, 
	public menuController:MenuController,
	public modalController:ModalController, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider, public loadingCtrl: LoadingController) {
		this.TryLogin();
		this.LoadSubCategories();
		this.menuController.swipeEnable(false);
		
		this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
		this.signupErrorString = value;
    });
	this.login_type=this.navParams.get("login_type");
  }
  ModalActive:boolean=false;
  launchLocationPage(){
		if(this.ModalActive==false)
		{
			this.ModalActive=true;
			let modal = this.modalController.create(LocationSelect);
	
			modal.onDidDismiss((location) => {
				this.ModalActive=false;
				if(location)
				{
				this.account.location=location.location;
				this.account.street_name=location.street_name;
				this.account.state=location.state;
				this.account.code=location.code;
				this.account.postcode=location.postcode;
				this.account.longitude=location.longitude;
				this.account.latitude=location.latitude;
				}
			});
	
			modal.present();
		}		

    }
  presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }
  Terms()
  {
	  let addModal = this.modalController.create('TermsPage');
		addModal.present();
  }
  TermsCondition()
  {
	  if(this.account.Terms==false)
	  {
		  this.account.Terms=true;
	  }
	  else
	  {
		  this.account.Terms=false;
	  }
  }
  
  TryLogin()
	{
		
		this.httpClient.post<any>(this.source+'/api/CheckLogin',{
			DeviceID:this.commonProvider.DeviceID
		})
		.subscribe(data => {
			if(data.Status==1)
			{
				this.navCtrl.setRoot("ContentPage");
			}
		},
		err => {
			this.Error=JSON.stringify(err);
		})
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

  SignUp()
  {
		if(this.account.firstname=="")
		{
			this.presentToast("Please enter your First Name");
			return false;
		}
		if(this.account.lastname=="")
		{
			this.presentToast("Please enter your Last Name");
			return false;
		}
		if(this.account.username=="")
		{
			this.presentToast("Please enter your User name");
			return false;
		}
		if(this.account.email=="")
		{
			this.presentToast("Please enter your Email ID");
			return false;
		}
		if(this.ValidateEmail(this.account.email)==false)
		{
			this.presentToast("Please enter a valid Email ID");
			return false;
		}
		if(this.account.password=="")
		{
			this.presentToast("Please enter a password");
			return false;
		}
		if(this.account.con_password=="")
		{
			this.presentToast("Please enter the confirm password");
			return false;
		}
		if(this.account.password!=this.account.con_password)
		{
			this.presentToast("Password and confirm password are not matching. Please re-enter.");
			return false;
		}
		if(this.navParams.get("login_type")==2)
		{
			if(this.account.fullname=="")
			{
				this.presentToast("Please enter a business/company name");
				return false;
			}
			if(this.sub_category.length==0)
			{
				this.presentToast("Please select your Sub Category");
				return false;
			}
			if(this.account.phone=="")
			{
				this.presentToast("Please enter your Phone number");
					return false;
			}
			if(this.ValidateContact(this.account.phone)==false)
			{
				this.presentToast("Please enter a valid Phone number");
				return false;
			}
			if(this.account.location=="")
			{
				this.presentToast("Please enter your Address");
				return false;
			}
			
		}
		if(this.navParams.get("login_type")!=2)
		{
			this.category={ID:0,CategoryID: 0, Name:'Select Category'};
			this.sub_category=[{ID:0,CategoryID:0, Name:'Select Sub Category'}];
		}
		if(this.account.Terms==false)
		{
			this.presentToast("You must accept Terms & Conditions");
			return false;
		}
		let main_data={
			device_id:this.commonProvider.DeviceID,
			otp:'',
			firstname:this.account.firstname,
			lastname:this.account.lastname,
			phone:this.account.phone,
			email:this.account.email,
			username:this.account.username,
			password:this.account.password,
			login_type: this.navParams.get("login_type"),
			location:this.account.location,
			street_name:this.account.street_name,
			state:this.account.state,
			code:this.account.code,
			postcode:this.account.postcode,
			longitude:this.account.longitude,
			latitude:this.account.latitude,
			category:this.category.ID,
			sub_category:this.sub_category,
			fullname: this.account.fullname,
			radius: this.account.radius,
			call_out_charge: this.account.call_out_charge,
			per_hour_charge: this.account.per_hour_charge
		};
		
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		this.httpClient.post<any>(this.source+'/api/send-otp',{
			phone:this.account.phone,
			email:this.account.email,
			username:this.account.username,
			login_type: this.navParams.get("login_type"),
		})
		.subscribe(data => {
			loader.dismiss();
			if(data.status==0)
			{
				this.presentToast(data.message);
			}
			else
			{
				this.navCtrl.setRoot("OtpPage",{main_data:main_data});
			}
		},
		err => {
			loader.dismiss();
			this.Error=JSON.stringify(err);
		})
  }
  Login()
  {
	  this.navCtrl.setRoot("LoginPage");
  }
  CheckLogin()
  {
	  
  }
	keyUpChecker(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker) && elementChecker!="+") {
			this.account.phone= elementChecker.slice(0, -1);
		}
		this.account.phone=this.account.phone.replace(" ","");
	}
	keyUpCheckerEmail(ev) {
		this.account.email=this.account.email.replace(" ","");
	}
  SetSubcategories(SC)
	{
		/*this.httpClient.post<any>('https://ptezone.com.au/api/GetSubCategories',{ID:this.category.ID}).subscribe(data => {
			this.SubCategories=[];
			this.sub_category=new Port1();/*.ID=0;
			this.sub_category.Name="";
			for(var i=0;i<data.SubCategories.length;i++)
			{
				this.port={ID: data.SubCategories[i].ID,Name:data.SubCategories[i].SubCategoryName};
				this.SubCategories.push(this.port);
				if(this.port.ID==SC)
				{
					this.sub_category=this.port;
				}
			}
		},
		err => {
				this.Error=JSON.stringify(err);	
		});*/
		
	}
	LoadCategories()
	{
		/*this.httpClient.get<any>('https://ptezone.com.au/api/GetCategories').subscribe(data => {
			for(var i=0;i<data.Categories.length;i++)
			{
				this.port={ID:data.Categories[i].ID, Name:data.Categories[i].CategoryName};
				this.Categories.push(this.port);	
			}
			console.log(this.Categories);
		},
		err => {
				console.log(err);	
				this.Error=JSON.stringify(err);
		});*/
	}
	LoadSubCategories()
	{
		this.httpClient.post<any>(this.source+'/api/GetSubCategories',{ID:0/*this.category.ID*/}).subscribe(data => {
			this.SubCategories=[];
			this.sub_category=[];/*new Port1();/*.ID=0;
			this.sub_category.Name="";*/
			for(var i=0;i<data.SubCategories.length;i++)
			{
				this.port={ID: data.SubCategories[i].ID, CategoryID: data.SubCategories[i].CategoryID, Name:data.SubCategories[i].SubCategoryName};
				this.SubCategories.push(this.port);
			}
			//this.sub_category={ID: 0, Name: 'Select a sub category'};
		},
		err => {
					this.Error=JSON.stringify(err);
		});
	}
	portChange(event: {
        component: SelectSearchableComponent,
        value: any 
    }) {
		if(this.category.Name!="")
		{
			this.LoadSubCategories();
		}
    }
	keyUpCheckerPKC(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.account.call_out_charge= elementChecker.slice(0, -1);
		}
		this.account.call_out_charge=this.account.call_out_charge.replace(" ","");
	}
	keyUpCheckerPHC(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.account.per_hour_charge= elementChecker.slice(0, -1);
		}
		this.account.per_hour_charge=this.account.per_hour_charge.replace(" ","");
	}
	keyUpCheckerFT(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.account.radius= elementChecker.slice(0, -1);
		}
		this.account.radius=this.account.radius.replace(" ","");
	}
}
