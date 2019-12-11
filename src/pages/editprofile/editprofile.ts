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
import { ImageViewerController } from 'ionic-img-viewer';
/**
 * Generated class for the EditprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
class PortEP {
    public ID: number;
	public CategoryID: number;
    public Name: string;
}
@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {
	User:any={
		Role:'',
		avatar: '',
		created_at: '',
		dob: '',
		email: '',
		first_name: '',
		id: 0,
		last_login: '',
		last_name: '',
		password: '',
		permissions: '',
		phone: '',
		status: 0,
		updated_at: '',
		username: ''
	};
	DeviceID:string="";
	Error:string="";
	Categories:PortEP[]=[];
	SubCategories:PortEP[]=[];
	port:PortEP;
	category:PortEP[]=[];
	sub_category:PortEP[]=[];
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
	radius:any="";
	per_km_charge:any=0;
	per_hour_charge:any="";
	call_out_charge:any=0;
	
	basic_id:any=0;
	
	//Contact
	fl_basic_id:number=0;
	phone:string="";
	mobile:string="";
	email:string="";
	website:string="";
	contact_name:string="";
	
	//About
	short_desc:string="";
	about:string="";
	
	//Services
	services:string="";
	
	//Bank
	account_name:string="";
	bsb:string="";
	account_no:string="";
	
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient:HttpClient, public device:Device, public toastCtrl: ToastController, public sqlite: SQLite, public platform: Platform, public commonProvider: CommondataProvider, public menuController:MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public myApp: MyApp, public imageViewerController:ImageViewerController) {
	  this.LoadProfile();
	  this.menuController.close();
	  this.LoadSubCategories();
	  let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		if(this.commonProvider.Role=="Tradie")
		{
			setTimeout(()=>{
				loader.dismiss();
				this.LoadBasic();
				this.LoadContact();
				this.LoadAbout();
				this.LoadBank();
			},4000);
		}
		else
		{
			setTimeout(()=>{
				loader.dismiss();
			},1000);
		}
  }
  presentImage(myImage) {
    const imageViewer = this.imageViewerController.create(myImage);
    imageViewer.present();
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
					this.User.dob=this.formatDate(date);
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
	LoadProfile()
	{
		/*this.httpClient.post<any>('https://ptezone.com.au/api/CheckLogin',{
			DeviceID:this.commonProvider.DeviceID
		})
		.subscribe(data => {
			console.log(data);
			this.User=data.User;
		},
		err => {
			
		})*/
		this.User=this.commonProvider.User;
		this.commonProvider.LoadBasic();
		this.commonProvider.LoadContact();
		this.commonProvider.LoadAbout();
		this.commonProvider.LoadSkills();
		this.myApp.CheckLogin();
	}
	presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditprofilePage');
	this.menuController.close();
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
	keyUpChecker(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker) && elementChecker!="+") {
			this.User.phone= elementChecker.slice(0, -1);
		}
		this.User.phone=this.User.phone.replace(" ","");
	}
	keyUpCheckerFTK(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.radius= elementChecker.slice(0, -1);
		}
		this.radius=this.radius.replace(" ","");
		if(this.radius=="")
		{
			this.radius="0";
		}
	}
	keyUpCheckerPKC(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.call_out_charge= elementChecker.slice(0, -1);
		}
		this.call_out_charge=this.call_out_charge.replace(" ","");
	}
	keyUpCheckerPHC(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.per_hour_charge= elementChecker.slice(0, -1);
		}
		this.per_hour_charge=this.per_hour_charge.replace(" ","");
	}
	keyUpCheckerFT(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.radius= elementChecker.slice(0, -1);
		}
		this.radius=this.radius.replace(" ","");
	}
	keyUpCheckerEmail(ev) {
		this.User.email=this.User.email.replace(" ","");
	}
  UpdateProfile()
  {
		if(this.User.first_name=="")
		{
			this.presentToast("Please enter your First name");
			return false;
		}
		if(this.User.last_name=="")
		{
			this.presentToast("Please enter your Last name");
			return false;
		}
		if(this.User.username=="")
		{
			this.presentToast("Please enter your Username");
			return false;
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
		this.httpClient.post<any>('https://ptezone.com.au/api/UpdateProfile',{
			DeviceID:this.commonProvider.DeviceID,
			firstname:this.User.first_name,
			lastname:this.User.last_name,
			username:this.User.username,
			phone:this.User.phone,
			dob:this.User.dob
		})
		.subscribe(data => {
			loader.dismiss();
			if(data.Error==0)
			{
				setTimeout(() => {
						this.commonProvider.GetLoginDetails(this.commonProvider.DeviceID);
					}, 1000);
				this.presentToast(data.Message);
			}
			else
			{
				this.presentToast(data.Message);
			}
		},
		err => {
			loader.dismiss();
		})
  }
 
  UploadAvatar()
  {
	  if(this.ModalActiv==false)
	  {
		  this.ModalActiv=true;
		  let addModal = this.modalCtrl.create('ItemCreatePage',{avatar:1});
		addModal.onDidDismiss(item => {
			this.ModalActiv=false;
			if (item) {
				let loader:any = this.loadingCtrl.create({
					spinner: "hide",
					content: `<div class="custom-spinner-container">
									<div class="custom-spinner-box">
										<img src="assets/img/spinner.gif" width="100%"/>
									</div>
								</div>`
					});
				loader.present();
				this.httpClient.post<any>('https://ptezone.com.au/api/UpdateAvatar',{
					id:this.User.id,
					image:item.upload
				}).subscribe(data => {
					this.presentToast(data.Message);
					this.commonProvider.GetLoginDetails(this.commonProvider.DeviceID);
					setTimeout(()=>{
						loader.dismiss();
						this.LoadProfile();
					},2000);
				},
				err => {
					loader.dismiss();
					this.presentToast("Something went wrong");		
					this.Error=JSON.stringify(err);
				});
			}
		})
		addModal.present();
	  }
  }
  //Tradie Information
  LoadBasic()
	{
		let Basic=this.commonProvider.tradie_basic;
		if(Basic!=null)
		{
			/*if(Basic.category!=0 && Basic.category!=0)
			{
				for(var i=0; i<this.Categories.length;i++)
				{
					if(this.Categories[i].ID==Basic.category)
					{
						this.category.push(this.Categories[i]);
						this.LoadSubCategories();
					}
				}
				setTimeout(()=>{
					this.SetSubcategories(Basic.sub_category);
				},2000);
			}*/
			this.fullname=Basic.fullname;
			this.location=Basic.location;
			this.ABN=Basic.ABN;
			this.house_no=Basic.house_no;
			this.street_name=Basic.street_name;
			this.suburb=Basic.suburb;
			this.state=Basic.state;
			this.code=Basic.code;
			this.postcode=Basic.postcode;
			this.longitude=Basic.longitude;
			this.latitude=Basic.latitude;
			this.radius=Basic.radius;
			this.basic_id=Basic.id;
			this.per_hour_charge=Basic.per_hour_charge;
			this.call_out_charge=Basic.call_out_charge;
			for(var i=0;i<this.commonProvider.skills.length;i++)
			{
				this.sub_category.push({ID:this.commonProvider.skills[i].sub_category, CategoryID:this.commonProvider.skills[i].category, Name: this.commonProvider.skills[i].SubCategoryName});
			}
			
		}
	}
	LoadContact()
	{
		this.phone=this.commonProvider.contact.phone;
		this.mobile=this.commonProvider.contact.mobile;
		this.email=this.commonProvider.contact.email;
		this.website=this.commonProvider.contact.website;
		this.contact_name=this.commonProvider.contact.contact_name;
	}
	LoadAbout()
	{
		this.short_desc=this.commonProvider.about.short_desc;
		this.about=this.commonProvider.about.about;
	}
	LoadService()
	{
		this.services=this.commonProvider.services.services;	
	}
	LoadBank()
	{
		this.account_name=this.commonProvider.bank.account_name;
		this.bsb=this.commonProvider.bank.bsb;
		this.account_no=this.commonProvider.bank.account_no;
	}
	SetSubcategories(SC)
	{
		/*this.httpClient.post<any>('https://ptezone.com.au/api/GetSubCategories',{ID:this.category.ID}).subscribe(data => {
			this.SubCategories=[];
			this.sub_category=[];/*.ID=0;
			this.sub_category.Name="";
			for(var i=0;i<data.SubCategories.length;i++)
			{
				this.port={ID: data.SubCategories[i].ID,CategoryID:this.category.ID, Name:data.SubCategories[i].SubCategoryName};
				this.SubCategories.push(this.port);
				if(this.port.ID==SC)
				{
					this.sub_category.push(this.port);
				}
			}
		},
		err => {
					
		});
		*/
	}
	LoadCategories()
	{
		this.httpClient.get<any>('https://ptezone.com.au/api/GetCategories').subscribe(data => {
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
		this.SubCategories=[];
		this.httpClient.post<any>('https://ptezone.com.au/api/GetSubCategories',{ID:0}).subscribe(data => {
			
			this.sub_category=[];
			for(var i=0;i<data.SubCategories.length;i++)
			{
				this.port={ID: data.SubCategories[i].ID, CategoryID: data.SubCategories[i].CategoryID, Name:data.SubCategories[i].SubCategoryName};
				this.SubCategories.push(this.port);
			}
		},
		err => {
					
		});
	}
	portChange(event: {
        component: SelectSearchableComponent,
        value: any 
    }) {
		alert(JSON.stringify(this.category));
		/*if(this.category.Name!="")
		{
			this.LoadSubCategories();
		}*/
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
	SaveBasic()
	{
		if(this.User.first_name=="")
		{
			this.presentToast("Please enter your First name");
			return false;
		}
		if(this.User.last_name=="")
		{
			this.presentToast("Please enter your Last name");
			return false;
		}
		if(this.User.username=="")
		{
			this.presentToast("Please enter your Username");
			return false;
		}
		
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
		if(this.User.phone=="")
		{
			this.presentToast("Please enter your Phone number");
			return false;
		}
		if(this.ValidateContact(this.User.phone)==false)
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
		if(this.per_hour_charge=="")
		{
			this.presentToast("Please enter your per hour charges");
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
			this.httpClient.post<any>('https://ptezone.com.au/api/SaveFreelanceBasicAll',
			{
				device_id:this.commonProvider.DeviceID,
				firstname:this.User.first_name,
				lastname:this.User.last_name,
				category:this.category,
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
				per_hour_charge:this.per_hour_charge,
				call_out_charge:this.call_out_charge,
				phone:this.User.phone,
				mobile:this.mobile,
				username:this.User.username,
				website:this.website,
				contact_name:this.contact_name,
				short_desc:this.short_desc,
				about:this.about,
				services:this.services,
				account_name: this.account_name,
				bsb:this.bsb,
				account_no: this.account_no
			}).subscribe(data => {
				if(data.Error!=1)
				{
					this.commonProvider.LoadBasic();
					this.commonProvider.LoadContact();
					this.commonProvider.LoadAbout();
					this.commonProvider.LoadBank();
					this.commonProvider.GetLoginDetails(this.commonProvider.DeviceID);
					
					this.presentToast("Profile updated successfully");
					setTimeout(()=>{
						loader.dismiss();
					},3000);
				}
				else
				{
					loader.dismiss();
					this.presentToast(data.Message);
				}
			},
			err => {
					loader.dismiss();
					this.Error=JSON.stringify(err);
			});
		}
	}
	GoHome()
	{
		if(this.commonProvider.Role=="Tradie")
		{
			this.navCtrl.setRoot("TradiehomePage");
		}
		else if(this.commonProvider.Role=="User")
		{
			this.navCtrl.setRoot("ContentPage");
		}
	}

}
