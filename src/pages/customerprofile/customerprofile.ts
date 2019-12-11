import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, MenuController, LoadingController, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-customerprofile',
  templateUrl: 'customerprofile.html',
})
export class CustomerprofilePage {
	Customer:any=null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient:HttpClient, public device:Device, public toastCtrl: ToastController, public platform: Platform, public commonProvider: CommondataProvider, public menuController:MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
	  this.Customer=this.navParams.get("Customer");
  }
	Deactivate(status)
	{
		this.httpClient.post<any>('https://ptezone.com.au/api/ActivationCustomer',{id:this.Customer.id,status:status}).subscribe(data => {
			alert(data.message);
			this.Customer.active_status=status;
		},
		err => {
					
		});
		
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerprofilePage');
  }

}
