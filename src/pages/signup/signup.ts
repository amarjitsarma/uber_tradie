import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController, ModalController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { HttpClient } from '@angular/common/http';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';

class Port1 {
    public ID: number;
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
	category:Port1;
	sub_category:Port1;
  account: { firstname: string, lastname: string, phone: string, email: string, username: string, password: string,con_password:string, Terms:boolean, address:string } = {
    firstname: '',
	lastname: '',
	phone: '',
    email: '',
	username: '',
    password: '',
	con_password:'',
	Terms:false,
	address:''
  };
	login_type:any=1;
	DeviceID:string="";
	Error:string="No error";
  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
	public navParams: NavParams,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
	public device:Device,
	public httpClient:HttpClient, 
	public menuController:MenuController,
	public modalController:ModalController) {
		this.LoadCategories();
		this.menuController.swipeEnable(false);
		this.TryLogin();
		this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
		this.signupErrorString = value;
    });
	this.login_type=this.navParams.get("login_type");
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
  TryLogin()
	{
		
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/CheckLogin',{
			DeviceID:this.DeviceID
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
			var re = /^\d{10}$/;
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
	  
	  if(this.account.Terms==false)
	  {
		  this.presentToast("You must accept Terms & Conditions");
		  return false;
	  }
	  if(this.ValidateEmail(this.account.email)==false)
	  {
		  this.presentToast("Invalid Email ID.");
		  return false;
	  }
	  if(this.ValidateContact(this.account.phone)==false)
	  {
		  this.presentToast("Invalid contact no.");
		  return false;
	  }
	  if(this.navParams.get("login_type")==2)
	  {
		  if(this.account.phone=="")
		  {
			  this.presentToast("Phone no cannot be empty");
				return false;
		  }
		  if(this.account.address=="")
		  {
			  this.presentToast("Address cannot be empty");
				return false;
		  }
	  }
	  if(this.account.password!=this.account.con_password)
	  {
		  this.presentToast("Password and confirm password should be same");
		  return false;
	  }
	  this.DeviceID=this.device.uuid;
	if(this.DeviceID==null)
	{
		this.DeviceID="534b8b5aeb906015";
	}
	if(this.account.firstname!="" && this.account.lastname!="" && this.account.email!="" && this.account.username!="" && this.account.password!="")
	{
		
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/signup',{
			DeviceID:this.DeviceID,
			firstname:this.account.firstname,
			lastname:this.account.lastname,
			phone:this.account.phone,
			email:this.account.email,
			username:this.account.username,
			password:this.account.password,
			login_type: this.navParams.get("login_type"),
			address: this.account.address,
			category:this.category.ID,
			sub_category:this.sub_category.ID,
		})
		.subscribe(data => {
			if(data.status==0)
			{
				this.presentToast(data.message);
			}
			else
			{
				this.navCtrl.setRoot("OtpPage",{email:this.account.email,user_id:data.UserID, login_type: this.navParams.get("login_type")});
			}
		},
		err => {
			this.Error=JSON.stringify(err);
		})
	}
	else{
		this.presentToast("Please fill up data");
	}
	  
  }
  Login()
  {
	  this.navCtrl.setRoot("LoginPage");
  }
  CheckLogin()
  {
	  
  }
  SetSubcategories(SC)
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetSubCategories',{ID:this.category.ID}).subscribe(data => {
			this.SubCategories=[];
			this.sub_category=new Port1();/*.ID=0;
			this.sub_category.Name="";*/
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
		});
		
	}
	LoadCategories()
	{
		this.httpClient.get<any>('http://uber.ptezone.com.au/api/GetCategories').subscribe(data => {
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
		});
	}
	LoadSubCategories()
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetSubCategories',{ID:this.category.ID}).subscribe(data => {
			this.SubCategories=[];
			this.sub_category=new Port1();/*.ID=0;
			this.sub_category.Name="";*/
			for(var i=0;i<data.SubCategories.length;i++)
			{
				this.port={ID: data.SubCategories[i].ID,Name:data.SubCategories[i].SubCategoryName};
				this.SubCategories.push(this.port);
			}
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
}
