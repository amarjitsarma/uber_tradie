import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController, LoadingController, ToastController, Platform, Nav, MenuController  } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { Device } from '@ionic-native/device';


import { Freelancelist7Page } from '../freelancelist7/freelancelist7';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';
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
	source:string="https://ptezone.com.au";//"http://localhost:8000";
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public modalCtrl: ModalController, public menuController:MenuController, public myApp:MyApp, public commonProvider:CommondataProvider) {
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
		this.httpClient.get<any>(this.source+'/api/GetSavedKeywords').subscribe(data => {
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
		this.httpClient.post<any>(this.source+'/api/GetKeywords',{fl_basic_id:this.fl_basic_id}).subscribe(data => {
			this.Keywords=data.Keywords;
		},
		err => {
				console.log(err);	
		});
	}
	AddKeyword()
	{
		this.fl_basic_id=this.navParams.get("basic_id");
		this.httpClient.post<any>(this.source+'/api/SaveKeyword',{fl_basic_id:this.fl_basic_id,keyword:this.keyword.Name}).subscribe(data => {
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
	Error:string="";
	Done()
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
		this.fl_basic_id=this.navParams.get("basic_id");
		this.httpClient.post<any>(this.source+'/api/ActivateFreelancer',{device_id:this.commonProvider.DeviceID}).subscribe(data => {
			this.commonProvider.LoadBasic();
			this.commonProvider.LoadWorkingHours();
			this.commonProvider.LoadContact();
			this.commonProvider.LoadPhotos();
			this.commonProvider.LoadAbout();
			this.commonProvider.LoadService();
			this.commonProvider.LoadTaglines();
			this.commonProvider.LoadKeywords();
			this.commonProvider.GetLoginDetails(this.commonProvider.DeviceID);
			setTimeout(()=>{
				loader.dismiss();
				this.ShowAlert("Success","Thank you. Your details are saved.");
				this.navCtrl.setRoot('TradiehomePage');
			},2000);
		},
		err => {
			loader.dismiss();
			this.Error=JSON.stringify(err);	
		});
	}
	DeleteSelected()
	{
		this.httpClient.post<any>(this.source+'/api/DeleteKeyword',{ids:this.delItems}).subscribe(data => {
			this.LoadKeywords();
		},
		err => {
				console.log(err);	
		});
	}
}
