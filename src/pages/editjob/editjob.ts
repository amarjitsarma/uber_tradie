import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content, Platform, ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { JobpostPage } from '../jobpost/jobpost';
import { MyApp } from '../../app/app.component';
import { ImageViewerController } from 'ionic-img-viewer';
@IonicPage()
@Component({
  selector: 'page-editjob',
  templateUrl: 'editjob.html',
})
export class EditjobPage {
	Bids:any[]=[];
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider, public imageViewerController:ImageViewerController, public viewCtrl: ViewController) {
	this.LoadBids();
	this.LoadJob();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditjobPage');
  }
  status:any=2;
  LoadJob()
	{
		let scope=this;
		scope.httpClient.get<any>(this.source+'/api/GetProjectbasic/'+scope.navParams.get("project_id")).subscribe(data => {
			this.status=data.status;
		},err=>{
			
		});
	}
  LoadBids()
	{
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container" style="bordoer-radius:100px;">
								<div class="custom-spinner-box">
									<img src="assets/img/spinner.gif" width="100%"/>
								</div>
							</div>`
		});
		loader.present();
		let ProjectID = this.navParams.get('project_id');
		this.httpClient.post<any>(this.source+'/api/GetProjectBids',{ProjectID:ProjectID}).subscribe(data => {
			this.Bids=data.Bids;
			loader.dismiss();
			
		},
		err => {
			console.log(err);	
			loader.dismiss();
		});
	}
	Error:string="";
	ApproveBid(BidID)
	{
		this.Error=BidID;
		var scope=this;
		let alert = scope.alertCtrl.create({
			title: 'Confirm selection',
			message: 'Do you want to approve this bid?',
			buttons: [
			{
				text: 'Cancel',
				role: 'cancel',
				handler: () => {
				console.log('Cancel clicked');
				}
			},
			{
				text: 'Approve',
				handler: () => {
					let loader:any = this.loadingCtrl.create({
					spinner: "hide",
					content: `<div class="custom-spinner-container" style="bordoer-radius:100px;">
											<div class="custom-spinner-box">
												<img src="assets/img/spinner.gif" width="100%"/>
											</div>
										</div>`
					});
					loader.present();
					scope.httpClient.post<any>(this.source+'/api/ApproveBid',{bid_id:BidID}).subscribe(data => {
						scope.LoadBids();
						loader.dismiss();
						this.viewCtrl.dismiss();
					},
					err => {
						scope.Error=JSON.stringify(err);
						loader.dismiss();
						this.viewCtrl.dismiss();
					});
				}
			}
			]
		});
		alert.present();
	}

}
