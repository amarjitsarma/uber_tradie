import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchPage } from './../search/search';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { ItemDetailPage } from '../item-detail/item-detail';
@IonicPage()
class JobPort1 {
    public ID: number;
    public Name: string;
}
class Suberb {
    public Suberb: string;
}
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
	cardItems: any[];
	RemotLocation: boolean=true;
	Suberbs:Suberb[]=[];
	suberb:Suberb={Suberb:'All'};
	port:Suberb;
	sub_category:any=0;
    constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav) {
		this.LoadFreeLancers();
		this.LoadSuberbs();
	}
	portChange(event: {
        component: SelectSearchableComponent,
        value: any 
    }) {
		this.LoadFreeLancers();
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
	LoadFreeLancers()
	{
		if(this.navParams.get("sub_category")!="")
		{
			this.sub_category=this.navParams.get("sub_category");
		}
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetFreelancers',{RemotLocation:this.RemotLocation,Suburb:this.suberb.Suberb,sub_category:this.sub_category}).subscribe(data => {
			this.cardItems=data.Freelancers;
		},
		err => {
				console.log(err);	
		});
	}
	ReadMore(id)
	{
		this.navCtrl.push('ItemDetailPage',{id:id});
	}
}
