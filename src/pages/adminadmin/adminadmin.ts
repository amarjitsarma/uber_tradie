import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content, ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';

@IonicPage()
@Component({
  selector: 'page-adminadmin',
  templateUrl: 'adminadmin.html',
})
export class AdminadminPage {
	Admins:any[]=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider, public viewCtrl: ViewController) {
  }
	ionViewDidEnter()
	{
		this.LoadAdmins();
	}
	LoadAdmins()
	{
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		this.httpClient.post<any>('https://ptezone.com.au/api/GetAdmin',
		{
			id:this.commonProvider.User.id
		}).subscribe(data => {
			loader.dismiss();
			this.Admins=data;
		},
		err => {
			loader.dismiss();
			console.log(err);	
		});
	}
	NewAdmin()
	{
		this.navCtrl.push("AdmincreatePage");
	}
	OpenAdmin(Admin)
	{
		this.navCtrl.push("AdmincreatePage",{Admin:Admin});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminadminPage');
  }

}
