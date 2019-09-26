import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';

@IonicPage()
@Component({
  selector: 'page-bidform',
  templateUrl: 'bidform.html',
})
export class BidformPage {
	DeviceID:string="";
	bid_amount:string="";
	completion_time:string="";
	bid_desc:string="";
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device) {
  }
	PlaceBid()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		let ProjectID=this.navParams.get("ProjectID");
		if(this.bid_amount!="" && this.completion_time!="" && this.bid_desc!="")
		{
			let postData={
				device_id:this.DeviceID,
				project_id:ProjectID,
				bid_amount:this.bid_amount,
				completion_time:this.completion_time,
				bid_desc:this.bid_desc
			}
			this.httpClient.post<any>('http://uber.ptezone.com.au/api/SaveBid',postData).subscribe(data => {
				this.ShowAlert("Success","Your bid is submitted");
				this.navCtrl.setRoot('ContentPage');
			},
			err => {
					console.log(err);	
			});
		}
		else
		{
			this.ShowAlert("Error", "Please fill up all the fields");
		}
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad BidformPage');
  }

}
