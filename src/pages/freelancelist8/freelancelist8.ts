import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav, MenuController  } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Freelancelist7Page } from '../freelancelist7/freelancelist7';
class Port1 {
    public ID: number;
    public Name: string;
}
@IonicPage()
@Component({
  selector: 'page-freelancelist8',
  templateUrl: 'freelancelist8.html',
})
export class Freelancelist8Page {
	SavedKeywords: Port1[]=[];
	keyword: Port1;
    port: Port1;
	Keywords:any;
	delItems:any=[];
	fl_basic_id:number=0;
	DeviceID:string="";
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public modalCtrl: ModalController, public menuController:MenuController) {
	  this.LoadKeywords();
	  this.LoadSavedKeywords();
	  this.fl_basic_id=this.navParams.get("basic_id");
	  this.menuController.swipeEnable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist8Page');
  }
	LoadSavedKeywords()
	{
		this.httpClient.get<any>('http://uber.ptezone.com.au/api/GetSavedKeywords').subscribe(data => {
			for(var i=0;i<data.Keywords.length;i++)
			{
				this.port={ID:data.Keywords[i].ID, Name:data.Keywords[i].keyword};
				this.SavedKeywords.push(this.port);	
			}
		},
		err => {
				console.log(err);	
		});
	}
	AddNew()
	{
		let addModal = this.modalCtrl.create('KeywordcreatePage');
		addModal.onDidDismiss(item => {
			if (item) {
				this.LoadSavedKeywords();
			}
		})
		addModal.present();
	}
	LoadKeywords()
	{
		this.fl_basic_id=this.navParams.get("basic_id");
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetKeywords',{fl_basic_id:this.fl_basic_id}).subscribe(data => {
			this.Keywords=data.Keywords;
		},
		err => {
				console.log(err);	
		});
	}
	AddKeyword()
	{
		this.fl_basic_id=this.navParams.get("basic_id");
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/SaveKeyword',{fl_basic_id:this.fl_basic_id,keyword:this.keyword.Name}).subscribe(data => {
			this.LoadKeywords();
		},
		err => {
				console.log(err);	
		});
	}
	AddDelete(check){
		console.log(check.check);
		if(check.check==true)
		{
			this.delItems.push(check.id);
		}
		else
		{
			var i=this.delItems.indexOf(check.id);
			this.delItems.splice(i, 1);;
		}
		console.log(this.delItems);
	}
	GoPrevious()
	{
		this.navCtrl.setRoot(Freelancelist7Page,{basic_id:this.fl_basic_id});
	}
	Done()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		this.fl_basic_id=this.navParams.get("basic_id");
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/ActivateFreelancer',{device_id:this.DeviceID}).subscribe(data => {
			this.ShowAlert("Success","Thank you. Your details are saved.");
			this.navCtrl.setRoot('ContentPage');
		},
		err => {
				console.log(err);	
		});
	}
	DeleteSelected()
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/DeleteKeyword',{ids:this.delItems}).subscribe(data => {
			this.LoadKeywords();
		},
		err => {
				console.log(err);	
		});
	}
}
