import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchPage } from './../search/search';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Freelancelist2Page } from '../freelancelist2/freelancelist2';
import { Freelancelist3Page } from '../freelancelist3/freelancelist3';
import { Freelancelist5Page } from '../freelancelist5/freelancelist5';
/**
 * Generated class for the Businesslist4Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freelancelist4',
  templateUrl: 'freelancelist4.html',
})
export class Freelancelist4Page {

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public modalCtrl: ModalController) {
	this.LoadPhotos();
  }
	Photos:any=[];
  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist4Page');
  }
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.LoadPhotos();
      }
    })
    addModal.present();
  }
	LoadPhotos()
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetPhotos',{
			basic_id:3
		}).subscribe(data => {
			this.Photos=data.Photos;
		},
		err => {
			alert("Unable to upload");		
		});
	}
	GoPrevious()
	{
		this.navCtrl.setRoot(Freelancelist3Page);
	}
	GoNext()
	{
		this.navCtrl.setRoot(Freelancelist5Page);
	}
}
