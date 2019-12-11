import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav, MenuController, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';
import { LocationSelect } from '../location-select/location-select';

@IonicPage()
class Port12 {
    public ID: number;
    public Name: string;
}
@Component({
  selector: 'page-tradiebasic',
  templateUrl: 'tradiebasic.html',
})
export class TradiebasicPage {
	
	Categories:Port12[]=[];
	SubCategories:Port12[]=[];
	port:Port12;
	category:Port12;
	sub_category:Port12;
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
	DeviceID:any="";
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
	
	constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public menuController:MenuController, public commonProvider:CommondataProvider, public modalController: ModalController, public viewCtrl: ViewController) {
		
		this.LoadCategories();
		setTimeout(()=>{
			this.LoadBasic();
			this.LoadContact();
			this.LoadAbout();
			this.LoadService();
		},1000);
	}
	LoadBasic()
	{
		let Basic=this.commonProvider.tradie_basic;
		if(Basic!=null)
		{
			if(Basic.category!=0 && Basic.category!=0)
			{
				for(var i=0; i<this.Categories.length;i++)
				{
					if(this.Categories[i].ID==Basic.category)
					{
						this.category=this.Categories[i];
						this.LoadSubCategories();
					}
				}
				setTimeout(()=>{
					this.SetSubcategories(Basic.sub_category);
				},1000);
			}
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
	SetSubcategories(SC)
	{
		this.httpClient.post<any>('https://ptezone.com.au/api/GetSubCategories',{ID:this.category.ID}).subscribe(data => {
			this.SubCategories=[];
			this.sub_category=new Port12();/*.ID=0;
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
					
		});
		
	}
	LoadCategories()
	{
		this.httpClient.get<any>('https://ptezone.com.au/api/GetCategories').subscribe(data => {
			for(var i=0;i<data.Categories.length;i++)
			{
				this.port={ID:data.Categories[i].ID, Name:data.Categories[i].CategoryName};
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
		this.httpClient.post<any>('https://ptezone.com.au/api/GetSubCategories',{ID:this.category.ID}).subscribe(data => {
			this.SubCategories=[];
			this.sub_category=new Port12();/*.ID=0;
			this.sub_category.Name="";*/
			for(var i=0;i<data.SubCategories.length;i++)
			{
				this.port={ID: data.SubCategories[i].ID,Name:data.SubCategories[i].SubCategoryName};
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
		if(this.category.Name!="")
		{
			this.LoadSubCategories();
		}
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
	Close()
	{
		if(this.commonProvider.Role=="Admin" || this.commonProvider.Role=="Tradie")
		{
			this.viewCtrl.dismiss();
		}
		else
		{
			this.navCtrl.setRoot("ContentPage");
		}
	}
	presentToast(Message) {
		const toast = this.toastCtrl.create({
			message: Message,
			duration: 3000
		});
		toast.present();
	}
	SaveBasic()
	{
		if(this.category.Name=="")
		{
			this.presentToast("Category cannot be empty");
			return;
		}
		if(this.sub_category.Name=="")
		{
			this.presentToast("Sub Category cannot be empty");
			return;
		}
		if(this.fullname=="")
		{
			this.presentToast("Business name cannot be empty");
			return;
		}
		if(this.location=="")
		{
			this.presentToast("Location cannot be empty");
			return;
		}
		if(this.house_no=="")
		{
			this.presentToast("House no cannot be empty");
			return;
		}
		if(this.street_name=="")
		{
			this.presentToast("Stret name cannot be empty");
			return;
		}
		if(this.suburb=="")
		{
			this.presentToast("Suburb cannot be empty");
			return;
		}
		if(this.state=="")
		{
			this.presentToast("State cannot be empty");
			return;
		}
		if(this.postcode=="")
		{
			this.presentToast("Post code cannot be empty");
			return;
		}
		
		if(this.mobile=="")
		{
			this.presentToast("Mobile no cannot be empty");
			return;
		}
		if(this.email=="")
		{
			this.presentToast("Email ID cannot be empty");
			return;
		}
		if(this.contact_name=="")
		{
			this.presentToast("Contact name cannot be empty");
			return;
		}
		if(this.short_desc=="")
		{
			this.presentToast("Short description cannot be empty");
			return;
		}
		if(this.about=="")
		{
			this.presentToast("About cannot be empty");
			return;
		}
		if(this.services=="")
		{
			this.presentToast("Services cannot be empty");
			return;
		}
		if(this.ValidateEmail(this.email)==false)
		{
			this.presentToast("Enter valid Email");
			return;
		}
		if(this.ValidateContact(this.mobile)==false)
		{
			this.presentToast("Enter valid Mobile no");
			return;
		}
		if(this.ValidateContact(this.phone)==false)
		{
			this.presentToast("Enter valid Phone no");
			return;
		}
		if(this.category.Name!="" && this.sub_category.Name!="" && this.fullname!="" && this.location!="" && this.house_no!="" && this.street_name!="" && this.suburb!="" && this.state!="" && this.postcode!="")
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
				category:this.category.ID,
				sub_category:this.sub_category.ID,
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
				email:this.email,
				website:this.website,
				contact_name:this.contact_name,
				short_desc:this.short_desc,
				about:this.about,
				services:this.services
			}).subscribe(data => {
				this.commonProvider.LoadBasic();
				this.commonProvider.LoadContact();
				this.commonProvider.LoadAbout();
				this.commonProvider.LoadService();
				
				this.presentToast("Profile updated successfully");
				setTimeout(()=>{
					loader.dismiss();
					if(this.commonProvider.Role=="User")
					{
						this.navCtrl.setRoot('TradieadvancePage',{basic_id:data.id});
					}
					else
					{
						this.viewCtrl.dismiss();
					}
				},5000);
			},
			err => {
					loader.dismiss();
					this.Error=JSON.stringify(err);
			});
		}
	}
	Error:string="";
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad TradiebasicPage');
  }

}
