import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchPage } from './../search/search';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Freelancelist6Page } from '../freelancelist6/freelancelist6';
import { Freelancelist8Page } from '../freelancelist8/freelancelist8';
class Port1 {
    public ID: number;
    public Name: string;
}
@IonicPage()
@Component({
  selector: 'page-freelancelist7',
  templateUrl: 'freelancelist7.html',
})
export class Freelancelist7Page {
	SavedTaglines: Port1[]=[];
	tagline: Port1;
    port: Port1;
	Taglines:any;
	delItems:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public modalCtrl: ModalController) {
	  this.LoadTaglines();
	  this.LoadSavedTaglines();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist7Page');
  }
	LoadSavedTaglines()
	{
		this.httpClient.get<any>('http://uber.ptezone.com.au/api/GetSavedTaglines').subscribe(data => {
			for(var i=0;i<data.Taglines.length;i++)
			{
				this.port={ID:data.Taglines[i].ID, Name:data.Taglines[i].tagline};
				this.SavedTaglines.push(this.port);	
			}
			console.log(this.Categories);
		},
		err => {
				console.log(err);	
		});
	}
	LoadTaglines()
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetTaglines',{fl_basic_id:1}).subscribe(data => {
			this.Taglines=data.Taglines;
		},
		err => {
				console.log(err);	
		});
	}
	AddTagline()
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/SaveTagline',{fl_basic_id:1,tagline:this.tagline.Name}).subscribe(data => {
			this.LoadTaglines();
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
		this.navCtrl.setRoot(Freelancelist6Page);
	}
	GoNext()
	{
		this.navCtrl.setRoot(Freelancelist8Page);
	}
}
