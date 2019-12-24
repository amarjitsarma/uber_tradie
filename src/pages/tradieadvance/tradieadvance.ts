import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, AlertController, LoadingController, ToastController, Platform, MenuController, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { Device } from '@ionic-native/device';

import { CommondataProvider } from '../../providers/commondata/commondata';
class Port13 {
    public ID: number;
    public Name: string;
}
@IonicPage()
@Component({
  selector: 'page-tradieadvance',
  templateUrl: 'tradieadvance.html',
})
export class TradieadvancePage {
	fl_basic_id:number=0;
	sunFrom:string="";
	sunTo:string="";
	monFrom:string="";
	monTo:string="";
	tueFrom:string="";
	tueTo:string="";
	wedFrom:string="";
	wedTo:string="";
	thuFrom:string="";
	thuTo:string="";
	friFrom:string="";
	friTo:string="";
	satFrom:string="";
	satTo:string="";
	
	
	Photos:any=[];
	
	
	SavedTaglines: Port13[]=[];
	tagline: Port13;
    port: Port13;
	Taglines:any;
	delItemst:any=[];
	
	SavedKeywords: Port13[]=[];
	keyword: Port13;
	Keywords:any;
	delItemsk:any=[];
	
	DeviceID:string="";
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
	
	Error:string="";
	source:string="https://ptezone.com.au";//"http://localhost:8000";
	constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public menuController:MenuController, public commonProvider: CommondataProvider, public viewCtrl: ViewController, public modalCtrl: ModalController)
	{
		this.LoadWorkingHours();
		this.LoadPhotos();
		this.LoadTaglines();
		this.LoadSavedTaglines();
		
		this.LoadKeywords();
		this.LoadSavedKeywords();
	}
	SaveWorkingHour()
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
	  this.httpClient.post<any>(this.source+'/api/SaveWorkingHours',{
		  fl_basic_id:this.commonProvider.tradie_basic.id,
		  monday:this.monFrom+"-"+this.monTo,
		  tuesday:this.tueFrom+"-"+this.tueTo,
		  wednessday:this.wedFrom+"-"+this.wedTo,
		  thursday:this.thuFrom+"-"+this.thuTo,
		  friday:this.friFrom+"-"+this.friTo,
		  saturday:this.satFrom+"-"+this.satTo,
		  sunday:this.sunFrom+"-"+this.sunTo,
	  }).subscribe(data => {
		  this.commonProvider.LoadWorkingHours();
		  setTimeout(()=>{
			  loader.dismiss();
			  if(this.commonProvider.Role=="User")
			  {
				this.navCtrl.setRoot('Freelancelist3Page',{basic_id:this.fl_basic_id});
			  }
			  else
			  {
				  this.viewCtrl.dismiss();
			  }
		  },2000);
	},
	err => {
		loader.dismiss();
		this.Error=JSON.stringify(err);
				
	});
  }
  LoadWorkingHours()
  {
	    let WorkingHour=this.commonProvider.working_hours;
		this.monFrom=WorkingHour.monday.substr(0,WorkingHour.monday.indexOf("-"));
		this.monTo=WorkingHour.monday.substr(WorkingHour.monday.indexOf("-")+1);
		this.tueFrom=WorkingHour.tuesday.substr(0,WorkingHour.tuesday.indexOf("-"));
		this.tueTo=WorkingHour.tuesday.substr(WorkingHour.tuesday.indexOf("-")+1);
		this.wedFrom=WorkingHour.wednessday.substr(0,WorkingHour.wednessday.indexOf("-"));
		this.wedTo=WorkingHour.wednessday.substr(WorkingHour.wednessday.indexOf("-")+1);
		this.thuFrom=WorkingHour.thursday.substr(0,WorkingHour.thursday.indexOf("-"));
		this.thuTo=WorkingHour.thursday.substr(WorkingHour.thursday.indexOf("-")+1);
		this.friFrom=WorkingHour.friday.substr(0,WorkingHour.friday.indexOf("-"));
		this.friTo=WorkingHour.friday.substr(WorkingHour.friday.indexOf("-")+1);
		this.satFrom=WorkingHour.saturday.substr(0,WorkingHour.saturday.indexOf("-"));
		this.satTo=WorkingHour.saturday.substr(WorkingHour.saturday.indexOf("-")+1);
		this.sunFrom=WorkingHour.sunday.substr(0,WorkingHour.sunday.indexOf("-"));
		this.sunTo=WorkingHour.sunday.substr(WorkingHour.sunday.indexOf("-")+1);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TradieadvancePage');
  }
  addItem() {
	  let addModal = this.modalCtrl.create('ItemCreatePage',{basic_id:this.commonProvider.tradie_basic.id});
    addModal.onDidDismiss(item => {
      if (item) {
		  this.commonProvider.LoadPhotos();
		  setTimeout(()=>{
			this.LoadPhotos();
		  },1000);
      }
    })
    addModal.present();
  }
	LoadPhotos()
	{
		this.Photos=this.commonProvider.photos;
	}
	
	LoadSavedTaglines()
	{
		this.httpClient.get<any>(this.source+'/api/GetSavedTaglines').subscribe(data => {
			for(var i=0;i<data.Taglines.length;i++)
			{
				this.port={ID:data.Taglines[i].ID, Name:data.Taglines[i].tagline};
				this.SavedTaglines.push(this.port);	
			}
		},
		err => {
				console.log(err);	
		});
	}
	NewTagline(){
		let addModal = this.modalCtrl.create('TaglinecreatePage');
		addModal.onDidDismiss(item => {
			if (item) {
				this.LoadSavedTaglines();
			}
		})
		addModal.present();
	}
	LoadTaglines()
	{
		this.Taglines=this.commonProvider.taglines;
	}
	AddTagline()
	{
		this.fl_basic_id=this.navParams.get("basic_id");
		this.httpClient.post<any>(this.source+'/api/SaveTagline',{fl_basic_id:this.commonProvider.tradie_basic.id,tagline:this.tagline.Name}).subscribe(data => {
			this.commonProvider.LoadTaglines();
			setTimeout(()=>{
				this.LoadTaglines();
			},1000);
		},
		err => {
				console.log(err);	
		});
	}
	AddDeleteT(check){
		console.log(check.check);
		if(check.check==true)
		{
			this.delItemst.push(check.id);
		}
		else
		{
			var i=this.delItemst.indexOf(check.id);
			this.delItemst.splice(i, 1);;
		}
		console.log(this.delItemst);
	}
	DeleteSelectedT()
	{
		this.httpClient.post<any>(this.source+'/api/DeleteTagline',{ids:this.delItemst}).subscribe(data => {
			this.commonProvider.LoadTaglines();
			setTimeout(()=>{
				this.LoadTaglines();
			},1000);
		},
		err => {
				this.Error=JSON.stringify(err);	
		});
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
		this.Keywords=this.commonProvider.keywords;
	}
	AddKeyword()
	{
		this.fl_basic_id=this.navParams.get("basic_id");
		this.httpClient.post<any>(this.source+'/api/SaveKeyword',{fl_basic_id:this.commonProvider.tradie_basic.id,keyword:this.keyword.Name}).subscribe(data => {
			this.commonProvider.LoadKeywords();
			setTimeout(()=>{
				this.LoadKeywords();
			},1000);
		},
		err => {
				console.log(err);	
		});
	}
	AddDeleteK(check){
		console.log(check.check);
		if(check.check==true)
		{
			this.delItemsk.push(check.id);
		}
		else
		{
			var i=this.delItemsk.indexOf(check.id);
			this.delItemsk.splice(i, 1);;
		}
		console.log(this.delItemsk);
	}
	DeleteSelectedK()
	{
		this.httpClient.post<any>(this.source+'/api/DeleteKeyword',{ids:this.delItemsk}).subscribe(data => {
			this.commonProvider.LoadKeywords();
			setTimeout(()=>{
				this.LoadKeywords();
			},1000);
		},
		err => {
				this.Error=JSON.stringify(err);	
		});
	}
	Close()
	{
		if(this.commonProvider.Role=="User")
		{
			this.navCtrl.setRoot('Freelancelist3Page',{basic_id:this.fl_basic_id});
		}
		else
		{
			this.viewCtrl.dismiss();
		}
	}
}
