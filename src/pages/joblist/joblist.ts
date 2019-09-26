import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
@IonicPage()
class Suberb {
    public Suberb: string;
}
@Component({
  selector: 'page-joblist',
  templateUrl: 'joblist.html',
})

export class JoblistPage {
	Projects:any=[];
	Suberbs:Suberb[]=[];
	suberb:Suberb={Suberb:'All'};
	port:Suberb;
	portChange(event: {
        component: SelectSearchableComponent,
        value: any 
    }) {
		this.LoadProjects();
    }
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device) {
	  this.LoadProjects();
	  this.LoadSuberbs();
  }
	RemoteEnable(){
		if(this.RemotLocation==true)
		{
			this.suberb={Suberb:"All"};
		}
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
						Suberb:this.suberb.Suberb,
						RemotLocation:this.RemotLocation};
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetProjects',posted_data).subscribe(data => {
			this.Projects=data.Projects;
		},
		err => {
				console.log(err);	
		});
	}
	DoShow(Suberb)
	{
		let Suberb1="";
		if(Suberb.Address==null)
		{
			if(this.RemotLocation==true)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			Suberb1=Suberb.Address.suberb;
			if(this.RemotLocation==true)
			{
				return true;
			}
			else
			{
				if(this.suberb.Suberb=="All")
				{
					return true;
				}
				else if(this.suberb.Suberb==Suberb1)
				{
					return true;
				}
				else
				{
					return false;
				}
			}
		}
	}
	BrowsePrice()
	{
		let alert = this.alertCtrl.create();
		alert.setTitle('Budget range');
		alert.addInput({
		type: 'radio',
		label: 'All',
		value: '0',
		checked: this.budget_0
		});
		alert.addInput({
		type: 'radio',
		label: '$1-$100',
		value: '1',
		checked: this.budget_1
		});
		alert.addInput({
		type: 'radio',
		label: '$101-$500',
		value: '2',
		checked: this.budget_2
		});
		alert.addInput({
		type: 'radio',
		label: '$501-$1000',
		value: '3',
		checked: this.budget_3
		});
		alert.addInput({
		type: 'radio',
		label: '$1001 and Above',
		value: '4',
		checked: this.budget_4
		});
		alert.addButton('Cancel');
		alert.addButton({
		text: 'OK',
		handler: data => {
			if(data==0)
			{
				this.budget_0=true;
				this.budget_1=false;
				this.budget_2=false;
				this.budget_3=false;
				this.budget_4=false;
				this.max_budget=10000000000;
				this.min_budget=0;
			}
			else if(data==1)
			{
				this.budget_0=false;
				this.budget_1=true;
				this.budget_2=false;
				this.budget_3=false;
				this.budget_4=false;
				this.max_budget=100;
				this.min_budget=1;
			}
			else if(data==2)
			{
				this.budget_0=false;
				this.budget_1=false;
				this.budget_2=true;
				this.budget_3=false;
				this.budget_4=false;
				this.max_budget=500;
				this.min_budget=101;
			}
			else if(data==3)
			{
				this.budget_0=false;
				this.budget_1=false;
				this.budget_2=false;
				this.budget_3=true;
				this.budget_4=false;
				this.max_budget=501;
				this.min_budget=1000;
			}
			else if(data==4)
			{
				this.budget_0=false;
				this.budget_1=false;
				this.budget_2=false;
				this.budget_3=false;
				this.budget_4=true;
				this.max_budget=10000000000;
				this.min_budget=1001;
			}
			if(data==0 || data==1 || data==2 || data==3 || data==4)
			{
				this.LoadProjects();
			}
		}
		});
		alert.present();
	}
	BrowseStatus()
	{
		let alert = this.alertCtrl.create();
		alert.setTitle('Hide tasks that are already assigned');
		alert.addInput({
		type: 'checkbox',
		label: 'Hide',
		value: '1',
		checked: this.show_assigned
		});
		alert.addButton('Cancel');
		alert.addButton({
		text: 'Okay',
		handler: data => {
			if(data==1)
			{
				this.show_assigned=true;
			}
			else
			{
				this.show_assigned=false;
			}
			this.LoadProjects();
		}
		});
		alert.present();
	}
	SortBy()
	{
		let alert = this.alertCtrl.create();
		alert.setTitle('Sort By');
		alert.addInput({
		type: 'radio',
		label: 'Posted',
		value: '0',
		checked: this.short_by_posted
		});
		alert.addInput({
		type: 'radio',
		label: 'Budget',
		value: '1',
		checked: this.short_by_budget
		});
		alert.addButton('Cancel');
		alert.addButton({
			text: 'OK',
			handler: data => {
				if(data==0)
				{
					this.short_by_posted=true;
					this.short_by_budget=false;
				}
				else if(data==1)
				{
					this.short_by_posted=false;
					this.short_by_budget=true;
				}
				if(data==0 || data==1)
				{
					this.LoadProjects();
				}
			}
		});
		alert.present();
		
	}
	LoadSuberbs()
	{
		this.httpClient.get<any>('http://uber.ptezone.com.au/api/LoadSuberbs').subscribe(data => {
			this.port={Suberb:"All"};
			this.Suberbs.push(this.port);
			for(var i=0;i<data.Suberbs.length;i++)
			{
				this.port={Suberb:data.Suberbs[i].suburb};
				this.Suberbs.push(this.port);
			}
		},
		err => {
				console.log(err);	
		});
	}
	BidNow(id)
	{
		this.navCtrl.push('BidformPage',{ProjectID:id});
	}
	GoDetail(id)
	{
		this.navCtrl.push('ProjectdetailPage',{ProjectID:id});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad JoblistPage');
  }

}
