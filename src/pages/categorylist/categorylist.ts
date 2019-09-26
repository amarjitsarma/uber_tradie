import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
@IonicPage()
@Component({
  selector: 'page-categorylist',
  templateUrl: 'categorylist.html',
})
export class CategorylistPage {
	Categories:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device) {
	  this.LoadCategories();
  }
	LoadCategories()
	{
		this.httpClient.get<any>('http://uber.ptezone.com.au/api/GetCategories').subscribe(data => {
			this.Categories=data.Categories;
		},
		err => {
				console.log(err);	
		});
	}
	OpenSubcategories(ID)
	{
		this.navCtrl.push('SubcategorylistPage',{ID:ID});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad CategorylistPage');
  }

}
