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
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
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
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public sqlite: SQLite,public commonProvider:CommondataProvider) {
	this.LoadCategories();
	this.LoadSubCategories();
	platform.ready().then(() => {
			this.DeviceID=this.device.uuid;
			var final_id=this.DeviceID+"_"+this.MakeString(100);
			this.sqlite.create({
				name: 'data.db',
				location: 'default'
			})
			.then((db: SQLiteObject) => {
			db.executeSql("create table device_id(id VARCHAR(200))", [])
				.then(() => {
					db.executeSql("insert into device_id(id) values('"+final_id+"')", []).then(()=>{this.CheckLogin()}).catch(e=>this.CheckLogin());
				})
				.catch(e => this.CheckLogin());
			})
			.catch(e => this.CheckLogin());
		});
	
  }
  MakeString(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
	CheckLogin()
	{
		this.platform.ready().then(() => {
			this.sqlite.create({
				name: 'data.db',
				location: 'default'
			}).then((db : SQLiteObject)=>{
				db.executeSql("select * from device_id", []).then(data=>{
					this.CheckLoginFinal(data.rows.item(0).id);
				}).catch(e=>console.log(e));
			}).catch(e=>console.log(e));
		});
	}
	CheckLoginFinal(DeviceID)
	{
		this.httpClient.post<any>('https://ptezone.com.au/api/CheckLogin',{
			DeviceID:DeviceID
		})
		.subscribe(data => {
			/*if(data.User.Role=="Tradie")
			{
				if(data.User.Tradie==null || data.User.Tradie.status==0)
				{
					this.navCtrl.setRoot(Freelancelist1Page);
				}
			}*/
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
		this.httpClient.post<any>(this.source+'/api/GetProjects',posted_data).subscribe(data => {
			this.Projects=data.Projects;
		},
		err => {
				console.log(err);	
		});
	}
	FreeLancer(){
		this.navCtrl.setRoot("CustomertradiePage");
	}
	PostProject()
	{
		this.navCtrl.push(JobpostPage);
	}
	LoadCategories()
	{
		this.httpClient.get<any>(this.source+'/api/GetCategories').subscribe(data => {
			this.Categories=data.Categories;
		},
		err => {
				console.log(err);	
		});
	}
	LoadFreeLancers()
	{
		this.httpClient.get<any>(this.source+'/api/GetCategories').subscribe(data => {
			this.Categories=data.Categories;
		},
		err => {
				console.log(err);	
		});
	}
	LoadSubCategories()
	{
		this.httpClient.post<any>(this.source+'/api/GetSubCategories',{}).subscribe(data => {
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
