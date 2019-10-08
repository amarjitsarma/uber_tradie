import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav, MenuController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
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
	longitude:string="";
	latitude:string="";
	radius:string="";
	DeviceID:any="";
	basic_id:any=0;
	constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public menuController:MenuController, public nav:Nav) {
		this.LoadBasic();
		this.LoadCategories();
		this.menuController.swipeEnable(false);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad Freelancelist1Page');
	}
	LoadBasic()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetFreelancebasic',{device_id:this.DeviceID})
		.subscribe(data => {
			if(data.Basic!=null)
			{
				if(data.Basic.category!=0 && data.Basic.category!=0)
				{
					for(var i=0; i<this.Categories.length;i++)
					{
						if(this.Categories[i].ID==data.Basic.category)
						{
							this.category=this.Categories[i];
							this.LoadSubCategories();
						}
					}
					this.SetSubcategories(data.Basic.sub_category);
				}
				this.fullname=data.Basic.fullname;
				this.location=data.Basic.location;
				this.house_no=data.Basic.house_no;
				this.street_name=data.Basic.street_name;
				this.suburb=data.Basic.suburb;
				this.state=data.Basic.state;
				this.code=data.Basic.code;
				this.postcode=data.Basic.postcode;
				this.longitude=data.Basic.longitude;
				this.latitude=data.Basic.latitude;
				this.radius=data.Basic.radius;
				this.basic_id=data.Basic.id;
			}
		},
		err => {
				console.log(err);	
		});
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
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		if(this.category.Name!="" && this.sub_category.Name!="" && this.fullname!="" && this.location!="" && this.house_no!="" && this.street_name!="" && this.suburb!="" && this.state!="" && this.postcode!="")
		{
			this.httpClient.post<any>('http://uber.ptezone.com.au/api/SaveFreelanceBasic',
			{
				device_id:this.DeviceID,
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
				this.navCtrl.setRoot('Freelancelist2Page',{basic_id:data.id});
			},
			err => {
					console.log(err);	
			});
		}
	}
	
}
