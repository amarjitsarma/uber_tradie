import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav, MenuController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
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
	fl_basic_id:number=0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public modalCtrl: ModalController, public menuController:MenuController) {
	this.LoadPhotos();
	this.fl_basic_id=this.navParams.get("basic_id");
	this.menuController.swipeEnable(false);
  }
	Photos:any=[];
  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist4Page');
  }
  addItem() {
	  this.fl_basic_id=this.navParams.get("basic_id");
    let addModal = this.modalCtrl.create('ItemCreatePage',{basic_id:this.fl_basic_id});
    addModal.onDidDismiss(item => {
      if (item) {
        this.LoadPhotos();
      }
    })
    addModal.present();
  }
	LoadPhotos()
	{
		this.fl_basic_id=this.navParams.get("basic_id");
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetPhotos',{
			basic_id:this.fl_basic_id
		}).subscribe(data => {
			this.Photos=data.Photos;
		},
		err => {
			
		});
	}
	GoPrevious()
	{
		this.navCtrl.setRoot('Freelancelist3Page',{basic_id:this.fl_basic_id});
	}
	GoNext()
	{
		this.navCtrl.setRoot('Freelancelist5Page',{basic_id:this.fl_basic_id});
	}
}
