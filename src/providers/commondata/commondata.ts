import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';

@Injectable()
export class CommondataProvider {
	DeviceID:string="";
	User:any=[];
	Role:string="";
	Status:any=0;
	First:any=0;
	source:string="https://ptezone.com.au";//"http://localhost:8000";
	
	constructor(public httpClient: HttpClient, public sqlite: SQLite, public platform: Platform, public device: Device) {
		this.GetDeviceID();
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
	CreateDeviceID()
	{
		let scope=this;
		this.platform.ready().then(() => {
			var final_id=this.device.uuid+"_"+this.MakeString(100);
			scope.sqlite.create({
				name: 'data.db',
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql("create table device_id(id VARCHAR(200))", []).then(() => {
					db.executeSql("insert into device_id(id) values('"+final_id+"')", []).then(()=>{this.GetDeviceID();}).catch(e=>
					scope.GetDeviceID()
					);
				})
				.catch(e => alert(e));
			})
			.catch(e => alert(e));
		});
	}
	GetDeviceID()
	{
		let scope=this;
		this.platform.ready().then(() => {
			scope.sqlite.create({
				name: 'data.db',
				location: 'default'
			}).then((db : SQLiteObject)=>{
				db.executeSql("select * from device_id", []).then(data=>{
					scope.DeviceID=data.rows.item(0).id;
				}).catch(e=>scope.CreateDeviceID());
			}).catch(e=>scope.CreateDeviceID());
		})
		.catch(e=>scope.CreateDeviceID());
	}
	GetDeviceIDWelcome()
	{
		let scope=this;
		this.platform.ready().then(() => {
			scope.sqlite.create({
				name: 'data.db',
				location: 'default'
			}).then((db : SQLiteObject)=>{
				db.executeSql("select * from device_id", []).then(data=>{
					scope.DeviceID=data.rows.item(0).id;
					scope.GetLoginDetails(scope.DeviceID);
				}).catch(e=>alert(e));
			}).catch(e=>alert(e));
		})
		.catch(e=>alert(e));
	}
	GetLoginDetails(DeviceID)
	{
		let scope=this;
		this.httpClient.post<any>(this.source+'/api/CheckLogin',{
			DeviceID:DeviceID
		})
		.subscribe(data => {
			console.log(data);
			if(data.Status!=0)
			{
				scope.User=data.User;
				scope.Role=data.User.Role;
				scope.Status=data.Status;
				scope.DeviceID=DeviceID;
			}
		},
		err => {
			
		})
	}
	SetFirst()
	{
		let scope=this;
		this.platform.ready().then(() => {
			//var final_id=this.device.uuid+"_"+this.MakeString(100);
			scope.sqlite.create({
				name: 'data.db',
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql("create table first_use(id int)", []).then(() => {
					db.executeSql("insert into first_use(id) values(1)", []);
				})
				.catch(e => console.log(e));
			})
			.catch(e => console.log(e));
		});
	}
	GetFirst()
	{
		let scope=this;
		this.platform.ready().then(() => {
			scope.sqlite.create({
				name: 'data.db',
				location: 'default'
			}).then((db : SQLiteObject)=>{
				db.executeSql("select * from first_use", []).then(data=>{
					scope.First=data.rows.item(0).id;
					scope.GetDeviceIDWelcome();
				}).catch(e=>console.log(e));
			}).catch(e=>console.log(e));
		})
		.catch(e=>console.log(e));
	}
	//Tradie
	tradie_basic:any={
		id:0,
		category:0,
		sub_category:0,
		fullname:"",
		ABN:"",
		location:"",
		house_no:"",
		street_name:"",
		suburb:"",
		state:"",
		code:"",
		postcode:"",
		longitude:0,
		latitude:0,
		radius:0,
		per_hour_charge:0,
		call_out_charge:0,
		CategoryName:"",
		SubCategoryName:"",
		status:null,
		remarks:""
	};
	LoadBasic()
	{
		this.httpClient.post<any>(this.source+'/api/GetFreelancebasic',{device_id:this.DeviceID})
		.subscribe(data => {
			if(data.Basic!=null)
			{
				this.tradie_basic=data.Basic;
			}
		},
		err => {
				console.log(err);	
		});
	}
	working_hours:any={
		monday:"",
		tuesday:"",
		wednessday:"",
		thursday:"",
		friday:"",
		saturday:"",
		sunday:""
	};
	LoadWorkingHours()
	{
		this.httpClient.post<any>(this.source+'/api/GetWorkingHours',{basic_id:this.tradie_basic.id})
			.subscribe(data => {
				console.log(data);
				if(data.WorkingHour!=null)
				{
					this.working_hours=data.WorkingHour;
				}
			},
			err => {
					console.log(err);	
			});
	}
	contact:any={
		phone:"",
		mobile:"",
		email:"",
		website:"",
		contact_name:""
	};
	LoadContact()
	{
		this.httpClient.post<any>(this.source+'/api/GetContact',{basic_id:this.tradie_basic.id})
		.subscribe(data => {
				if(data.Contact!=null)
				{
					this.contact=data.Contact;
				}
			},
			err => {
					
			});
	}
	photos:any[]=[];
	LoadPhotos()
	{
		this.httpClient.post<any>(this.source+'/api/GetPhotos',{basic_id:this.tradie_basic.id})
		.subscribe(data => {
			this.photos=data.Photos;
		},
		err => {
			
		});
	}
	about:any={
		short_desc:"",
		about:""
	};
	LoadAbout()
	{
		this.httpClient.post<any>(this.source+'/api/GetAbout',{basic_id:this.tradie_basic.id})
		.subscribe(data => {
			if(data.About!=null)
			{
				this.about=data.About;
			}
		},
		err => {
			
		});		
	}
	skills:any[]=[];
	LoadSkills()
	{
		this.httpClient.post<any>(this.source+'/api/GetSkills',{user_id:this.User.id})
		.subscribe(data => {
			this.skills=data;
		},
		err => {
			
		});	
	}
	
	bank:{ account_name:string, bsb:string, account_no:string }={ account_name:'', bsb:'', account_no:'' };
	LoadBank()
	{
		this.httpClient.post<any>(this.source+'/api/GetBank',{user_id:this.User.id})
		.subscribe(data => {
			this.bank=data;
		},
		err => {
			
		});	
	}
	
	services:any={
		services:""
	};
	LoadService()
	{
		this.httpClient.post<any>(this.source+'/api/GetService',{basic_id:this.tradie_basic.id})
		.subscribe(data => {
			if(data.Service!=null)
			{
				this.services=data.Service;
			}
		},
		err => {
			
		});		
	}
	taglines:any=[];
	LoadTaglines()
	{
		this.httpClient.post<any>(this.source+'/api/GetTaglines',{fl_basic_id:this.tradie_basic.id})
		.subscribe(data => {
			this.taglines=data.Taglines;
		},
		err => {
				console.log(err);	
		});
	}
	keywords:any=[];
	LoadKeywords()
	{
		this.httpClient.post<any>(this.source+'/api/GetKeywords',{fl_basic_id:this.tradie_basic.id})
		.subscribe(data => {
			this.keywords=data.Keywords;
		},
		err => {
				console.log(err);	
		});
	}
	GetFormattedDate(date)
	{
		let date1=new Date(date);
		let month:string[]=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		return date1.getDate()+" "+month[date1.getMonth()]+" "+date1.getFullYear();
	}
	GetTransactionDate(date)
	{
		let date1=new Date(date);
		let month:string[]=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		return "<span class='date_date'><b>"+date1.getDate()+"</b></span><br/><b>"+month[date1.getMonth()]+" "+date1.getFullYear()+"</b>";
	}
}
