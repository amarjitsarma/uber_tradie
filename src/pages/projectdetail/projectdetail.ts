import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { BidformPage } from '../bidform/bidform';
@IonicPage()
@Component({
  selector: 'page-projectdetail',
  templateUrl: 'projectdetail.html',
})
export class ProjectdetailPage {
	Project:any=null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device) {
	this.LoadProjects();
  }
	LoadProjects()
	{
		let ProjectID = this.navParams.get('ProjectID');
		this.httpClient.get<any>('http://uber.ptezone.com.au/api/GetProjects?ProjectID='+ProjectID).subscribe(data => {
			this.Project=data.Projects;
		},
		err => {
				console.log(err);	
		});
	}
	BidNow(id)
	{
		this.navCtrl.push(BidformPage,{ProjectID:id});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectdetailPage');
  }
	
}
