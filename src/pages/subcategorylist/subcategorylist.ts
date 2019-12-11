import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { CardsPage } from '../cards/cards';
@IonicPage()
@Component({
  selector: 'page-subcategorylist',
  templateUrl: 'subcategorylist.html',
})
export class SubcategorylistPage {
	SubCategories:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device) {
	this.LoadSubCategories();
  }
	LoadSubCategories()
	{
		let ID=this.navParams.get("ID");
		this.httpClient.post<any>('https://ptezone.com.au/api/GetSubCategories',{ID:ID}).subscribe(data => {
			this.SubCategories=data.SubCategories;
		},
		err => {
					
		});
	}
	OpenDetails(ID,Name)
	{
		this.navCtrl.push(CardsPage,{sub_category:ID,sub_category_name:Name,category:this.navParams.get("ID"),category_name:this.navParams.get("Name")});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad SubcategorylistPage');
  }

}
