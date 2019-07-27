import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { ProjectdetailPage } from '../projectdetail/projectdetail';
import { BidformPage } from '../bidform/bidform';
@IonicPage()
class Suberb {
    public Suberb: string;
}
@Component({
  selector: 'page-joblist',
  templateUrl: 'joblist.html',
})

export class JoblistPage {
	Projects:any=[];
	Suberbs:Suberb[]=[];
	suberb:Suberb={Suberb:''};
	port:Suberb;
	portChange(event: {
        component: SelectSearchableComponent,
        value: any 
    }) {
		
    }
	testRadioOpen:boolean;
	testRadioResult:any;
	RemotLocation:boolean=true;
	testCheckboxOpen:boolean;
	testCheckboxResult:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device) {
	  this.LoadProjects();
	  this.LoadSuberbs();
  }
	LoadProjects()
	{
		this.httpClient.get<any>('http://uber.ptezone.com.au/api/GetProjects').subscribe(data => {
			this.Projects=data.Projects;
		},
		err => {
				console.log(err);	
		});
	}
	BrowsePrice()
	{
		let alert = this.alertCtrl.create();
		alert.setTitle('Budget range');
		alert.addInput({
		type: 'radio',
		label: 'All',
		value: '0',
		checked: true
		});
		alert.addInput({
		type: 'radio',
		label: '$1-$100',
		value: '1'
		});
		alert.addInput({
		type: 'radio',
		label: '$101-$500',
		value: '2'
		});
		alert.addInput({
		type: 'radio',
		label: '$501-$1000',
		value: '3'
		});
		alert.addInput({
		type: 'radio',
		label: '$1001 and Above',
		value: '4'
		});
		alert.addButton('Cancel');
		alert.addButton({
		text: 'OK',
		handler: data => {
			this.testRadioOpen = false;
			this.testRadioResult = data;
		}
		});
		alert.present();
	}
	BrowseStatus()
	{
		let alert = this.alertCtrl.create();
		alert.setTitle('Hide tasks that are already assigned');
		alert.addInput({
		type: 'checkbox',
		label: 'Hide',
		value: '1'
		});
		alert.addButton('Cancel');
		alert.addButton({
		text: 'Okay',
		handler: data => {
			console.log('Checkbox data:', data);
			this.testCheckboxOpen = false;
			this.testCheckboxResult = data;
		}
		});
		alert.present();
	}
	LoadSuberbs()
	{
		this.httpClient.get<any>('http://uber.ptezone.com.au/api/LoadSuberbs').subscribe(data => {
			for(var i=0;i<data.Suberbs.length;i++)
			{
				this.port={Suberb:data.Suberbs[i].suberb};
				this.Suberbs.push(this.port);
			}
		},
		err => {
				console.log(err);	
		});
	}
	BidNow(id)
	{
		this.navCtrl.push(BidformPage,{ProjectID:id});
	}
	GoDetail(id)
	{
		this.navCtrl.push(ProjectdetailPage,{ProjectID:id});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad JoblistPage');
  }

}
