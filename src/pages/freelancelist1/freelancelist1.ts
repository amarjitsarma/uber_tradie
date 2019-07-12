import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchPage } from './../search/search';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Freelancelist2Page } from './../freelancelist2/freelancelist2';
@IonicPage()
class Port1 {
    public DistrictID: number;
    public DistrictName: string;
}
@Component({
  selector: 'page-freelancelist1',
  templateUrl: 'freelancelist1.html',
})
export class Freelancelist1Page {
	Services:any=[];
	SubCategories:any=[];
	Services1:Port1[]=[];
	SearchBusiness:any="";
	Sectors:Port1[]=[];
	Sector:any="";
	Types:Port1[]=[];
	Type:any="";
	ports: Port1[]=[];
    port: Port1;
	
	States:Port1[]=[];
	State:any="";
	Districts:Port1[]=[];
	District:any="";
	Gaunapalikas:Port1[]=[];
	Gaunapalika:any="";
	Towns:Port1[]=[];
	Town:any="";
	Municipalties:Port1[]=[];
	Municipalty:any="";
	Cities:Port1[]=[];
	City:any="";
	Wards:Port1[]=[];
	Ward:any="";
	Toles:Port1[]=[];
	Tole:any="";
	DeviceID:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav) {
	  this.LoadJobSectors();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist1Page');
  }
	LoadJobSectors()
	{
		this.httpClient.get<any>('http://blist.ptezone.com.au/api/GetAllJobSectors').subscribe(data => {
			//this.Districts=data;
			for(var i=0;i<data.length;i++)
			{
				this.port={DistrictID:data[i].JobSectorID,DistrictName:data[i].JobSectorName};
				this.Sectors.push(this.port);
			}
		},
		err => {
				console.log(err);	
		});
	}
	LoadJobTypes()
	{
		this.httpClient.post<any>('http://blist.ptezone.com.au/api/GetJobs',{ID:this.Sector.DistrictID}).subscribe(data => {
			//this.Cities=data;
			this.Types=[];
			for(var i=0;i<data.length;i++)
			{
				this.port={DistrictID: data[i].JobTypeID,DistrictName:data[i].SubTypeName};
				this.Types.push(this.port);
			}
		},
		err => {
					
		});
	}
	portChange(event: {
        component: SelectSearchableComponent,
        value: any 
    }) {
        console.log('port:', event.value);
		console.log(this.Sector);
		if(this.Sector!="")
		{
			this.LoadJobTypes();
		}
    }
	LoadStates()
	{
		this.httpClient.get<any>('http://blist.ptezone.com.au/api/GetAllStates').subscribe(data => {
			//this.Districts=data;
			for(var i=0;i<data.length;i++)
			{
				this.port={DistrictID:data[i].StateID,DistrictName:data[i].StateName};
				this.States.push(this.port);
			}
		},
		err => {
				console.log(err);	
		});
	}
	LoadDistricts()
	{
		this.httpClient.get<any>('http://blist.ptezone.com.au/api/GetDistrictByState?State='+this.State.DistrictName).subscribe(data => {
			//this.Districts=data;
			for(var i=0;i<data.length;i++)
			{
				this.port={DistrictID:data[i].DistrictID,DistrictName:data[i].DistrictName};
				this.Districts.push(this.port);
			}
		},
		err => {
				console.log(err);	
		});
	}
	LoadGaunapalikas()
	{
		this.httpClient.get<any>('http://blist.ptezone.com.au/api/GetVDCMunics?District='+this.District.DistrictName).subscribe(data => {
			//this.Districts=data;
			for(var i=0;i<data.length;i++)
			{
				this.port={DistrictID:data[i].DistrictID,DistrictName:data[i].DistrictName};
				this.Gaunapalikas.push(this.port);
			}
		},
		err => {
				console.log(err);	
		});
	}
	LoadTowns()
	{
		this.httpClient.get<any>('http://blist.ptezone.com.au/api/GetVDCMunics?District='+this.District.DistrictName).subscribe(data => {
			//this.Districts=data;
			for(var i=0;i<data.length;i++)
			{
				this.port={DistrictID:data[i].DistrictID,DistrictName:data[i].DistrictName};
				this.Towns.push(this.port);
			}
		},
		err => {
				console.log(err);	
		});
	}
	LoadMunicipalties()
	{
		this.httpClient.post<any>('http://blist.ptezone.com.au/api/GetMunics',{DistrictID:this.District.DistrictID}).subscribe(data => {
			//this.Districts=data;
			for(var i=0;i<data.length;i++)
			{
				this.port={DistrictID:data[i].DistrictID,DistrictName:data[i].DistrictName};
				this.Municipalties.push(this.port);
			}
		},
		err => {
				console.log(err);	
		});
	}
	LoadCities()
	{
		this.httpClient.get<any>('http://blist.ptezone.com.au/api/GetVDCMunics?District='+this.District.DistrictName).subscribe(data => {
			//this.Districts=data;
			for(var i=0;i<data.length;i++)
			{
				this.port={DistrictID:data[i].DistrictID,DistrictName:data[i].DistrictName};
				this.Cities.push(this.port);
			}
		},
		err => {
				console.log(err);	
		});
	}
	LoadWards()
	{
		this.httpClient.post<any>('http://blist.ptezone.com.au/api/GetWards',{VdcID: this.Municipalty.DistrictID, MunicID: this.Municipalty.DistrictID}).subscribe(data => {
			//this.Districts=data;
			for(var i=0;i<data.length;i++)
			{
				this.port={DistrictID:data[i].DistrictID,DistrictName:data[i].DistrictName};
				this.Municipalties.push(this.port);
			}
		},
		err => {
				console.log(err);	
		});
	}
	SaveBasic()
	{
		this.httpClient.get<any>('http://blist.ptezone.com.au/api/SaveFreelanceBasic',
		{
			job_sector:this.Sector,
			job_type:this.Type,
			fullname:this.Fullname,
			state:this.State,
			district:this.District,
			gaunapalika:this.Gaunapalika,
			town:this.Town,
			municipalty:this.Municipalty,
			city:this.City,
			ward_no:this.Ward,
			toll_name:this.Tole,
			street_name:this.Street,
			landmark:this.LandMark,
		}).subscribe(data => {
			this.navCtrl.setRoot(Freelancelist2Page);
		},
		err => {
				console.log(err);	
		});
	}
}
