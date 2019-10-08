import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Freelancelist1Page } from '../freelancelist1/freelancelist1';
import { JobpostPage } from '../jobpost/jobpost';
import { CardsPage } from '../cards/cards';
import { JoblistPage } from '../joblist/joblist';
@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})
export class ContentPage {
	Categories:any=[];
	SubCategories:any=[];
	DeviceID:string="";
	User:any={Tradie:null};
	testRadioOpen:boolean;
	testRadioResult:any;
	RemotLocation:boolean=true;
	testCheckboxOpen:boolean;
	testCheckboxResult:any;
	
	short_by_posted:boolean=false;
	short_by_budget:boolean=false;
	show_assigned:boolean=false;
	
	budget_0:boolean=true;
	budget_1:boolean=false;
	budget_2:boolean=false;
	budget_3:boolean=false;
	budget_4:boolean=false;
	max_budget:any=10000000000;
	min_budget:any=0;
	Projects:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav) {
	this.LoadCategories();
	this.LoadSubCategories();
	this.CheckLogin();
	
  }
	CheckLogin()
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
			if(data.User.Role=="Tradie")
			{
				if(data.User.Tradie==null || data.User.Tradie.status==0)
				{
					this.navCtrl.setRoot(Freelancelist1Page);
				}
			}
			console.log(data);
			this.User=data.User;
			if(this.User.Tradie!=null)
			{
				this.LoadProjects();
			}
		},
		err => {
			
		})
	}
	GoDetail(id)
	{
		this.navCtrl.push('ProjectdetailPage',{ProjectID:id});
	}
	LoadProjects()
	{
		let posted_data={short_by_posted:this.short_by_posted,
						short_by_budget:this.short_by_budget,
						show_assigned:this.show_assigned,
						budget_0:this.budget_0,
						budget_1:this.budget_1,
						budget_2:this.budget_2,
						budget_3:this.budget_3,
						budget_4:this.budget_4,
						Suberb:"All",
						RemotLocation:this.RemotLocation,
						sub_category:this.User.Tradie.sub_category};
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetProjects',posted_data).subscribe(data => {
			this.Projects=data.Projects;
		},
		err => {
				console.log(err);	
		});
	}
	FreeLancer(){
		this.navCtrl.setRoot(Freelancelist1Page);
	}
	PostProject()
	{
		this.navCtrl.setRoot(JobpostPage);
	}
	LoadCategories()
	{
		this.httpClient.get<any>('http://uber.ptezone.com.au/api/GetCategories').subscribe(data => {
			this.Categories=data.Categories;
		},
		err => {
				console.log(err);	
		});
	}
	LoadFreeLancers()
	{
		this.httpClient.get<any>('http://uber.ptezone.com.au/api/GetCategories').subscribe(data => {
			this.Categories=data.Categories;
		},
		err => {
				console.log(err);	
		});
	}
	LoadSubCategories()
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetSubCategories',{}).subscribe(data => {
			this.SubCategories=data.SubCategories;
		},
		err => {
					
		});
	}
	OpenSubcategories(ID)
	{
		this.navCtrl.push('SubcategorylistPage',{ID:ID});
	}
	OpenDetails(ID)
	{
		this.navCtrl.push(CardsPage,{sub_category:ID});
	}
	ViewMoreJobs()
	{
		this.navCtrl.push(JoblistPage);
	}
}
