import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { Device } from '@ionic-native/device';

import { SelectSearchableComponent } from 'ionic-select-searchable';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
	wh:number=0;
	kw:number=0;
	tl:number=0;
	add:number=0;
	serv:number=0;
	Tradie:{status:number,remarks:""}={status:1,remarks:""};
	item:any={  
				id:1,
				user_id:1,
				category:2,
				sub_category:2,
				fullname:"",
				location:"",
				house_no:"",
				street_name:"",
				suburb:"",
				state:"",
				code:"",
				postcode:"",
				longitude:"",
				latitude:"",
				radius:"",
				status:0,
				commission:0,
				created_at:"",
				updated_at:"",
				Photos:[],
				Contact:{  
						id:1,
						fl_basic_id:1,
						phone:"",
						mobile:"",
						email:"",
						website:"",
						contact_name:"",
						created_at:"",
						updated_at:""
					},
				User:{
					first_name:'',
					last_name:'',
					avatar:'',
					phone:'',
					email:''
				},
				About:{
					id:0,
					fl_basic_id:0,
					short_desc:"",
					about:"",
					created_at:"",
					updated_at:"" 
				},
				Keywords:[],
				WorkingHour:{  
						id:2,
						fl_basic_id:1,
						monday:"",
						tuesday:"",
						wednessday:"",
						thursday:"",
						friday:"",
						saturday:"",
						sunday:"",
						created_at:"",
						updated_at:""
					},
				Category:{  
						ID:2,
						CategoryName:"",
						description:"",
						cover_photo:"",
						thumbnail:"",
						status:1,
						created_at:"",
						updated_at:""
					},
				SubCategory:{  
						ID:2,
						CategoryID:2,
						SubCategoryName:"",
						Icon:"",
						cover_photo:"",
						short_desc:"",
						description:"",
						created_at:"",
						updated_at:""
					},
				Reviews:[],
				ReviewsCount:0,
				ReviewsSum:{cleaness: 0, punctuality: 0, friendliness: 0},
				Files: []
				}
	source:string="https://ptezone.com.au";//"http://localhost:8000";

	constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public commonProvider: CommondataProvider, public transfer: FileTransfer, public file: File, public documentViewer: DocumentViewer, public photoViewer: PhotoViewer) {
		
		this.LoadFreeLancer();
	}
	
	LoadFreeLancer()
	{
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container" style="height:100%; width:100%;">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		let id=this.navParams.get("id");
		if(id=="" || id==null)
		{
			id=1;
		}
		this.httpClient.post<any>(this.source+'/api/GetFreelancer',{id:id}).subscribe(data => {
			this.item=data.Freelancer;
			console.log(this.item);
			loader.dismiss();
		},
		err => {
			loader.dismiss();		
		});
	}
	showWorkingHour()
	{
		if(this.wh==0)
		{
			this.wh=1;
		}
		else
		{
			this.wh=0;
		}
	}
	showKeywords()
	{
		if(this.kw==0)
		{
			this.kw=1;
		}
		else
		{
			this.kw=0;
		}
	}
	showTaglines()
	{
		if(this.tl==0)
		{
			this.tl=1;
		}
		else
		{
			this.tl=0;
		}
	}
	showAddress()
	{
		if(this.add==0)
		{
			this.add=1;
		}
		else
		{
			this.add=0;
		}
	}
	showService()
	{
		if(this.serv==0)
		{
			this.serv=1;
		}
		else
		{
			this.serv=0;
		}
	}
	ConvertTime(time)
	{
		let hr=parseInt(time.substr(0,time.indexOf(":")));
		let min=time.substr(time.indexOf(":")+1);
		let newhr=hr%12;
		let tt="AM";
		if(hr>=12)
		{
			tt="PM";
		}
		return newhr.toString()+":"+min+" "+tt;
	}
	RequestQuote(id)
	{
		this.navCtrl.push('QuoteformPage',{id:id});
	}
	DownloadFile(file_name)
	{
		let loader:any = this.loadingCtrl.create({
			spinner: "hide",
			content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		let exts=file_name.split(".");
		if(exts[exts.length-1]=="pdf" || exts[exts.length-1]=="PDF")
		{
			loader.present();
			const fileTransfer: FileTransferObject = this.transfer.create();
			const url = encodeURI('https://ptezone.com.au/uploads/'+file_name);
			fileTransfer.download(url, this.file.externalDataDirectory + file_name).then((entry) => {
				loader.dismiss();
				alert('Download complete: ' + file_name);
				const options: DocumentViewerOptions = {
					title: file_name
				}
				this.documentViewer.viewDocument(entry.toURL(), 'application/pdf', options);
			}, (error) => {
				alert(JSON.stringify(error));
				loader.dismiss();
			});
		}
		else
		{
			this.photoViewer.show(encodeURI('https://ptezone.com.au/uploads/'+file_name));
		}
	}
	SubmitReview()
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
		this.httpClient.post<any>(this.source+'/api/SaveTradieReview',{status:this.Tradie.status,remarks:this.Tradie.remarks,tradie_id:this.item.id}).subscribe(data => {
			loader.dismiss();
			this.LoadFreeLancer();
			alert("Review submitted");
		},
		err => {
			loader.dismiss();	
		});
	}
	UpdateCommission()
	{
		this.httpClient.post<any>(this.source+'/api/UpdateCommission',{id:this.item.id,commission:this.item.commission})
		.subscribe(data => {
			this.LoadFreeLancer();
			alert(data.message);
		},
		err => {
					
		});

	}
	parseInt(string)
	{
		return parseInt(string);
	}
}
