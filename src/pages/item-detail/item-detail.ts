import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
	wh:number=0;
	kw:number=0;
	tl:number=0;
	add:number=0;
	serv:number=0;
	item:any={  
				id:1,
				user_id:1,
				category:2,
				sub_category:2,
				fullname:"",
				location:"",
				house_no:"",
				street_name:"",
				suburb:"",
				state:"",
				code:"",
				postcode:"",
				longitude:"",
				latitude:"",
				radius:"",
				status:0,
				created_at:"",
				updated_at:"",
				Photos:[],
				Contact:{  
						id:1,
						fl_basic_id:1,
						phone:"",
						mobile:"",
						email:"",
						website:"",
						contact_name:"",
						created_at:"",
						updated_at:""
					},
				About:{
					id:0,
					fl_basic_id:0,
					short_desc:"",
					about:"",
					created_at:"",
					updated_at:"" 
				},
				Keywords:[],
				WorkingHour:{  
						id:2,
						fl_basic_id:1,
						monday:"",
						tuesday:"",
						wednessday:"",
						thursday:"",
						friday:"",
						saturday:"",
						sunday:"",
						created_at:"",
						updated_at:""
					},
				Category:{  
						ID:2,
						CategoryName:"",
						description:"",
						cover_photo:"",
						thumbnail:"",
						status:1,
						created_at:"",
						updated_at:""
					},
				SubCategory:{  
						ID:2,
						CategoryID:2,
						SubCategoryName:"",
						Icon:"",
						cover_photo:"",
						short_desc:"",
						description:"",
						created_at:"",
						updated_at:""
					}
				}

	constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav) {
		this.LoadFreeLancer();
	}
	LoadFreeLancer()
	{
		let id=this.navParams.get("id");
		if(id=="" || id==null)
		{
			id=1;
		}
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetFreelancer',{id:id}).subscribe(data => {
			this.item=data.Freelancer;
			console.log(this.item);
		},
		err => {
					
		});
	}
	showWorkingHour()
	{
		if(this.wh==0)
		{
			this.wh=1;
		}
		else
		{
			this.wh=0;
		}
	}
	showKeywords()
	{
		if(this.kw==0)
		{
			this.kw=1;
		}
		else
		{
			this.kw=0;
		}
	}
	showTaglines()
	{
		if(this.tl==0)
		{
			this.tl=1;
		}
		else
		{
			this.tl=0;
		}
	}
	showAddress()
	{
		if(this.add==0)
		{
			this.add=1;
		}
		else
		{
			this.add=0;
		}
	}
	showService()
	{
		if(this.serv==0)
		{
			this.serv=1;
		}
		else
		{
			this.serv=0;
		}
	}
	ConvertTime(time)
	{
		let hr=parseInt(time.substr(0,time.indexOf(":")));
		let min=time.substr(time.indexOf(":")+1);
		let newhr=hr%12;
		let tt="AM";
		if(hr>=12)
		{
			tt="PM";
		}
		return newhr.toString()+":"+min+" "+tt;
	}
	RequestQuote(id)
	{
		this.navCtrl.push('QuoteformPage',{id:id});
	}
}
