import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';
@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient:HttpClient, public device:Device, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider) {
  }
  DeviceID:string="";

  ionViewDidLoad() {
    console.log('ionViewDidLoad MorePage');
  }
	GoTo(Page)
	{
		this.navCtrl.push(Page);
	}
	Logout()
	{
		this.httpClient.post<any>(this.source+'/api/logout',{
			DeviceID:this.commonProvider.DeviceID
		})
		.subscribe(data => {
			this.navCtrl.setRoot("WelcomePage");
		},
		err => {
			
		})
	}
}
