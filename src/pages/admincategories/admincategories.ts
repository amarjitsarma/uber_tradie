import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { CommondataProvider } from '../../providers/commondata/commondata';
@IonicPage()
@Component({
  selector: 'page-admincategories',
  templateUrl: 'admincategories.html',
})
export class AdmincategoriesPage {
	Categories:any[]=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public commonProvider: CommondataProvider) {
  }
  LoadCategories()
	{
		this.httpClient.get<any>('https://ptezone.com.au/api/GetCategories').subscribe(data => {
			this.Categories=data.Categories;
		},
		err => {
				console.log(err);	
		});
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmincategoriesPage');
  }
  ionViewDidEnter(){
	  this.LoadCategories();
  }
  CreateCategory(Category)
  {
	  this.navCtrl.push("NewcategoryPage",{category:Category});
  }

}
