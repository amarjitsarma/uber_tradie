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
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
	cardItems: any[];

    constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav) {
		this.LoadFreeLancers();
	}
	LoadFreeLancers()
	{
		this.httpClient.get<any>('http://uber.ptezone.com.au/api/GetFreelancers').subscribe(data => {
			this.cardItems=data.Freelancers;
		},
		err => {
				console.log(err);	
		});
	}
	ReadMore(id)
	{
		this.navCtrl.push(ItemDetailPage,{id:id});
	}
}
