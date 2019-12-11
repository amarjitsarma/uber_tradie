import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

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

	constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav, public commonProvider: CommondataProvider, public transfer: FileTransfer, public file: File) {
		
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
		this.httpClient.post<any>('https://ptezone.com.au/api/GetFreelancer',{id:id}).subscribe(data => {
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
		const fileTransfer: FileTransferObject = this.transfer.create();
		const url = encodeURI('https://ptezone.com.au/uploads/'+file_name)
		//const url = 'http://www.example.com/file.pdf';
		fileTransfer.download(url, this.file.externalDataDirectory + file_name).then((entry) => {
			alert('download complete: ' + entry.toURL());
		}, (error) => {
			alert(JSON.stringify(error));
		});
		//window.open();
	}
	SubmitReview()
	{
		this.httpClient.post<any>('https://ptezone.com.au/api/SaveTradieReview',{status:this.Tradie.status,remarks:this.Tradie.remarks,tradie_id:this.item.id}).subscribe(data => {
			this.LoadFreeLancer();
			alert("Review submitted");
		},
		err => {
					
		});
	}
	UpdateCommission()
	{
		this.httpClient.post<any>('https://ptezone.com.au/api/UpdateCommission',{id:this.item.id,commission:this.item.commission})
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
