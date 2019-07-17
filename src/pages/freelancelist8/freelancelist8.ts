import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchPage } from './../search/search';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Freelancelist7Page } from '../freelancelist7/freelancelist7';
class Port1 {
    public ID: number;
    public Name: string;
}
@IonicPage()
@Component({
  selector: 'page-freelancelist8',
  templateUrl: 'freelancelist8.html',
})
export class Freelancelist8Page {
	SavedKeywords: Port1[]=[];
	keyword: Port1;
    port: Port1;
	Keywords:any;
	delItems:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public modalCtrl: ModalController) {
	  this.LoadKeywords();
	  this.LoadSavedKeywords();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist8Page');
  }
	LoadSavedKeywords()
	{
		this.httpClient.get<any>('http://uber.ptezone.com.au/api/GetSavedKeywords').subscribe(data => {
			for(var i=0;i<data.Keywords.length;i++)
			{
				this.port={ID:data.Keywords[i].ID, Name:data.Keywords[i].keyword};
				this.SavedKeywords.push(this.port);	
			}
		},
		err => {
				console.log(err);	
		});
	}
	LoadKeywords()
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetKeywords',{fl_basic_id:1}).subscribe(data => {
			this.Keywords=data.Keywords;
		},
		err => {
				console.log(err);	
		});
	}
	AddKeyword()
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/SaveKeyword',{fl_basic_id:1,keyword:this.keyword.Name}).subscribe(data => {
			this.LoadKeywords();
		},
		err => {
				console.log(err);	
		});
	}
	AddDelete(check){
		console.log(check.check);
		if(check.check==true)
		{
			this.delItems.push(check.id);
		}
		else
		{
			var i=this.delItems.indexOf(check.id);
			this.delItems.splice(i, 1);;
		}
		console.log(this.delItems);
	}
	GoPrevious()
	{
		this.navCtrl.setRoot(Freelancelist7Page);
	}
	Done()
	{
		
	}
}
