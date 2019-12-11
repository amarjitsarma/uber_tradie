import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { ImageViewerController } from 'ionic-img-viewer';

@IonicPage()
@Component({
  selector: 'page-newcategory',
  templateUrl: 'newcategory.html',
})
export class NewcategoryPage {
	category:any=null;
	ID: any=0;
	CategoryName: string= "";
	description: string="";
 	cover_photo: string="";
	thumbnail: string="";
	status:any=null;
	
	new_cover_photo:string="";
	new_thumbnail:string="";

	constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public commonProvider: CommondataProvider, public modalCtrl: ModalController, public imageViewerController:ImageViewerController) {
		if(this.navParams.get("category")!=null)
		{
			this.category=this.navParams.get("category");
			this.ID=this.category.ID;
			this.CategoryName=this.category.CategoryName;
			this.description=this.category.description;
			this.cover_photo=this.category.cover_photo;
			this.thumbnail=this.category.thumbnail;
			this.status=this.category.status;
		}
	}
	ModalActiv:boolean=false;
	UploadCover()
	{
		if(this.ModalActiv==false)
		{
			this.ModalActiv=true;
			let addModal = this.modalCtrl.create('ItemCreatePage',{avatar:1});
			addModal.onDidDismiss(item => {
				this.ModalActiv=false;
				if (item) {
					this.new_cover_photo=item;
				}
			})
			addModal.present();
		}
	}
	UploadThumbnail()
	{
		if(this.ModalActiv==false)
		{
			this.ModalActiv=true;
			let addModal = this.modalCtrl.create('ItemCreatePage',{avatar:1});
			addModal.onDidDismiss(item => {
				this.ModalActiv=false;
				if (item) {
					this.new_thumbnail=item;
				}
			})
			addModal.present();
		}
	}
	Activation(Status)
	{
		
	}
	Save()
	{
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NewcategoryPage');
	}
	presentImage(myImage) {
		const imageViewer = this.imageViewerController.create(myImage);
		imageViewer.present();
	}
}
