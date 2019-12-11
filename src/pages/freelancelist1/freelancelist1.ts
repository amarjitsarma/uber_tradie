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
class Port1 {
    public ID: number;
    public Name: string;
}
@Component({
  selector: 'page-freelancelist1',
  templateUrl: 'freelancelist1.html',
})
export class Freelancelist1Page {
	//id 	user_id 	category 	sub_category 	fullname 	location 	house_no 	street_name 	
	//suburb 	state 	code 	postcode 	longitude 	latitude 	radius 	status
	Categories:Port1[]=[];
	SubCategories:Port1[]=[];
	port:Port1;
	category:Port1;
	sub_category:Port1;
	fullname:string="";
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
	constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public menuController:MenuController, public nav:Nav, public commonProvider:CommondataProvider, public modalController: ModalController, public viewCtrl: ViewController) {
		
		this.LoadCategories();
		setTimeout(()=>{
			this.LoadBasic();
		},1000);
		this.menuController.swipeEnable(false);
	}
	presentToast(Message) {
		const toast = this.toastCtrl.create({
			message: Message,
			duration: 3000
		});
		toast.present();
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad Freelancelist1Page');
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
	SetSubcategories(SC)
	{
		this.httpClient.post<any>('https://ptezone.com.au/api/GetSubCategories',{ID:this.category.ID}).subscribe(data => {
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
			this.sub_category=new Port1();/*.ID=0;
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
	SaveBasic()
	{
		if(this.category.Name!="" && this.sub_category.Name!="" && this.fullname!="" && this.location!="" && this.house_no!="" && this.street_name!="" && this.suburb!="" && this.state!="" && this.postcode!="")
		{
			this.httpClient.post<any>('https://ptezone.com.au/api/SaveFreelanceBasic',
			{
				device_id:this.commonProvider.DeviceID,
				category:this.category.ID,
				sub_category:this.sub_category.ID,
				fullname:this.fullname,
				location:this.location,
				house_no:this.house_no,
				street_name:this.street_name,
				suburb:this.suburb,
				state:this.state,
				code:this.code,
				postcode:this.postcode,
				longitude:this.longitude,
				latitude:this.latitude,
				radius:this.radius
			}).subscribe(data => {
				this.commonProvider.LoadBasic();
				this.presentToast("Profile updated successfully");
				setTimeout(()=>{
					if(this.commonProvider.Role=="User")
					{
						this.navCtrl.setRoot('Freelancelist2Page',{basic_id:data.id});
					}
					else
					{
						this.viewCtrl.dismiss();
					}
				},1000);
			},
			err => {
					console.log(err);	
			});
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
			this.navCtrl.setRoot("TradiehomePage");
		}
		else
		{
			this.navCtrl.setRoot("ContentPage");
		}
	}
	
}
