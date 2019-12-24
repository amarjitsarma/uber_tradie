import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, ModalController, Slides, Platform, Nav } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

import { Device } from '@ionic-native/device';

import { SelectSearchableComponent } from 'ionic-select-searchable';

import { SQLite } from '@ionic-native/sqlite';
import { TradieproviderProvider } from '../../providers/tradieprovider/tradieprovider';
import { LocationSelect } from '../location-select/location-select';
import { CommondataProvider } from '../../providers/commondata/commondata';

class PortTradies {
    public ID: number;
    public Name: string;
}

@IonicPage()

@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
	Categories:PortTradies[]=[];
	SubCategories:PortTradies[]=[];
	port:PortTradies={ID:0,Name:""};
	category:PortTradies={ID:0,Name:"All Categories"};
	sub_category:PortTradies[]=[];//{ID:0,Name:"All Sub categories"};
	
	cardItems: any[]=[];
	RemotLocation: boolean=true;
	distance:any=500;
	no_tradie:any=0;
	
	portChange(event: {
        component: SelectSearchableComponent,
        value: any 
    }) {
		if(this.category.Name!="")
		{
			this.LoadSubCategories();
		}
    }
	source:string="https://ptezone.com.au";//"http://localhost:8000";
	
    constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public sqlite: SQLite, public tradieProvider:TradieproviderProvider, public modalController:ModalController, public commonProvider: CommondataProvider) {
		this.LoadSubCategories();
	}
	parseInt(string)
	{
		return parseInt(string);
	}
	ionViewDidEnter()
	{
		this.tradieProvider.LoadMyLocation();
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
			if(this.navParams.get("category"))
			{
				this.category={ID:this.navParams.get("category"),Name:this.navParams.get("category_name")};
				this.LoadSubCategories();
			}
		},
		err => {
				console.log(err);	
		});
	}
	
	LoadSubCategories()
	{
		this.httpClient.post<any>(this.source+'/api/GetSubCategories',{ID:0/*this.category.ID*/}).subscribe(data => {
			this.SubCategories=[];
			
			/*this.port={ID:0, Name:"All Categories"};
			this.SubCategories.push(this.port);*/
			for(var i=0;i<data.SubCategories.length;i++)
			{
				this.port={ID: data.SubCategories[i].ID,Name:data.SubCategories[i].SubCategoryName};
				this.SubCategories.push(this.port);
			}
			if(this.navParams.get("sub_category"))
			{
				this.sub_category.push({ID:this.navParams.get("sub_category"),Name:this.navParams.get("sub_category_name")});
			}
		},
		err => {
					
		});
	}
	presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }
	LoadFreeLancers()
	{
		if(this.tradieProvider.location.location=="")
		{
			this.presentToast("Please select a location first");
			return;
		}
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container">
								<div class="custom-spinner-box">
									<img src="assets/img/spinner.gif" width="100%"/>
								</div>
							</div>`
		});
		loader.present();
				
		if(this.navParams.get("sub_category")!="" && this.navParams.get("sub_category")!=null)
		{
			this.sub_category.push({ID:this.navParams.get("sub_category"), Name:"Selected"});
		}
		this.httpClient.post<any>(this.source+'/api/GetFreelancers',{sub_category:this.sub_category, longitude: this.tradieProvider.location.longitude,latitude: this.tradieProvider.location.latitude, distance: this.distance}).subscribe(data => {
			this.cardItems=data.Freelancers;
			if(this.cardItems.length==0)
			{
				this.no_tradie=1;
			}
			else
			{
				this.no_tradie=0;
			}
			loader.dismiss();
		},
		err => {
				console.log(err);
				loader.dismiss();
		});
	}
	ReadMore(id)
	{
		this.navCtrl.push('ItemDetailPage',{id:id});
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
				this.tradieProvider.location.location=location.location;
				this.tradieProvider.location.longitude=location.longitude;
				this.tradieProvider.location.latitude=location.latitude;
				}
			});
	
			modal.present();
		}		

    }
}
