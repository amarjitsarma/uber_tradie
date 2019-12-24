import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, ModalController, ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { Device } from '@ionic-native/device';

import { SQLite } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';

@IonicPage()
@Component({
  selector: 'page-adminadmin',
  templateUrl: 'adminadmin.html',
})
export class AdminadminPage {
	Admins:any[]=[];
	source:string="https://ptezone.com.au";//"http://localhost:8000";

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
		this.httpClient.post<any>(this.source+'/api/GetAdmin',
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
