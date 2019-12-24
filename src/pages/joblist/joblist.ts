import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { Device } from '@ionic-native/device';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { JobproProvider } from '../../providers/jobpro/jobpro';
import { LocationSelect } from '../location-select/location-select';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { TradieproviderProvider } from '../../providers/tradieprovider/tradieprovider';


@IonicPage()
class PortJobs {
    public ID: number;
    public Name: string;
}
@Component({
  selector: 'page-joblist',
  templateUrl: 'joblist.html',
})

export class JoblistPage {
	Categories:PortJobs[]=[];
	SubCategories:PortJobs[]=[];
	port:PortJobs={ID:0,Name:""};
	category:PortJobs={ID:0,Name:"All Categories"};
	sub_category:PortJobs[]=[];//{ID:0,Name:"All Sub categories"};
	
	Projects:any=[];
	
	testRadioOpen:boolean;
	testRadioResult:any;
	RemotLocation:boolean=false;
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
	distance:any=500;
	location_type:any=3;
	no_job:any=0;
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalController : ModalController, public device: Device, public jobProvider:JobproProvider, public commonProvider: CommondataProvider, public tradieProvider: TradieproviderProvider) {
		this.LoadSubCategories();
		this.tradieProvider.LoadMyLocation();
		this.jobProvider.LoadMyLocation();
  }
  ionViewDidEnter()
	{
		this.tradieProvider.LoadMyLocation();
		this.jobProvider.LoadMyLocation();
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
	RemoteEnable(){
		if(this.location_type==2)
		{
			this.RemotLocation=true;
		}
		else
		{
			this.RemotLocation=false;
		}
	}
	presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }
  
	LoadProjects()
	{
		if(this.jobProvider.location.location=="" && (this.location_type==1 || this.location_type==3))
		{
			this.presentToast("Please select a location first");
			return;
		}
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container" style="bordoer-radius:100px;">
								<div class="custom-spinner-box">
									<img src="assets/img/spinner.gif" width="100%"/>
								</div>
							</div>`
		});
		loader.present();
		let posted_data={short_by_posted:this.short_by_posted,
			short_by_budget:this.short_by_budget,
			show_assigned:this.show_assigned,
			budget_0:this.budget_0,
			budget_1:this.budget_1,
			budget_2:this.budget_2,
			budget_3:this.budget_3,
			budget_4:this.budget_4,
			location_type:this.location_type,
			longitude: this.jobProvider.location.longitude, 
			latitude: this.jobProvider.location.latitude,
			distance:this.distance,
			sub_category:this.sub_category};
		this.httpClient.post<any>(this.source+'/api/GetProjects',posted_data).subscribe(data => {
			this.Projects=data.Projects;
			if(this.Projects.length==0)
			{
				this.no_job=1;
			}
			else
			{
				this.no_job=0;
			}
			loader.dismiss();
		},
		err => {
				console.log(err);
				loader.dismiss();
		});
	}
	DoShow(Project)
	{
		return true;
		/*console.log(Project);
		if(this.commonProvider.User.id!=Project.user_id)
		{
			return true;
		}
		else
		{
			return false;
		}*/
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
	LoadCategories()
	{
		this.httpClient.get<any>(this.source+'/api/GetCategories').subscribe(data => {
			this.port={ID:0, Name:"All Categories"};
			this.Categories.push(this.port);
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
		this.httpClient.post<any>(this.source+'/api/GetSubCategories',{ID:0/*this.category.ID*/}).subscribe(data => {
			this.SubCategories=[];
			//this.sub_category={ID:0,Name:"All Sub categories"};
			//this.port={ID:0, Name:"All Categories"};
			//this.SubCategories.push(this.port);
			for(var i=0;i<data.SubCategories.length;i++)
			{
				this.port={ID: data.SubCategories[i].ID,Name:data.SubCategories[i].SubCategoryName};
				this.SubCategories.push(this.port);
			}
		},
		err => {
					
		});
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
					this.jobProvider.location.location=location.location;
					this.jobProvider.location.longitude=location.longitude;
					this.jobProvider.location.latitude=location.latitude;
				}
			});
	
			modal.present();
		}		

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
