import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-givereview',
  templateUrl: 'givereview.html',
})
export class GivereviewPage {

  Projects:any=[];
	DeviceID:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public commonProvider:CommondataProvider) {
	  this.LoadProjects();
  }
  LoadProjects()
	{
		this.httpClient.post<any>('https://ptezone.com.au/api/GetMyAssignedPosts',{device_id:this.commonProvider.DeviceID}).subscribe(data => {
			this.Projects=data.Projects;
		},
		err => {
				console.log(err);	
		});
	}
	GoDetail(id)
	{
		this.navCtrl.push('ProjectdetailPage',{ProjectID:id, Mine: 1, Bids:1});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad GivereviewPage');
  }

}
