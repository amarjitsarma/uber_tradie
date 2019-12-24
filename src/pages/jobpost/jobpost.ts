import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { Device } from '@ionic-native/device';

import { SelectSearchableComponent } from 'ionic-select-searchable';
import { LocationSelect } from '../location-select/location-select';
import { SQLite } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';

import { ImageViewerController } from 'ionic-img-viewer';

@IonicPage({ name: "main", segment: "app" })
class JobPort1 {
    public ID: number;
    public Name: string;
}
@Component({
  selector: 'page-jobpost',
  templateUrl: 'jobpost.html',
})
export class JobpostPage {
	@ViewChild(Slides) slides: Slides;
	@ViewChild(Content) content: Content;
	project_id:any=0;
	Photos:any[]=[];
	UploadedPhotos:any[]=[];
	Categories:JobPort1[]=[];
	SubCategories:JobPort1[]=[];
	port:JobPort1={ID:0,Name:""};
	category:JobPort1={ID:0,Name:"Select Category"};
	sub_category:JobPort1={ID:0,Name:"Select Subcategory"};
	title:string="";
	description:string="";
	job_location:string="onsite";
	skills:string="";
	payment_type:string="full";
	budget:any="";
	working_hour:any="";
	address:{house_no:string, street_name:string, suberb:string, state:string, code:string, location:string, postcode:string, longitude: string, latitude:string}={
		house_no:"",
		street_name:"",
		suberb:"",
		state:"",
		code:"",
		location:"",
		postcode:"",
		longitude:"",
		latitude:""
	};
	Error:string="";
	DeviceID:string="";
	maxDate: any = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString();
	est_date:any="";
	est_date_show:any="";
	source:string="https://ptezone.com.au";//"http://localhost:8000";
	portChange(event: {
        component: SelectSearchableComponent,
        value: any 
    }) {
		if(this.category.Name!="")
		{
			this.LoadSubCategories();
		}
    }
	dateSelected(date)
	{
		alert(date);
	}
	keyUpChecker(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker) && elementChecker!="+") {
			this.budget= elementChecker.slice(0, -1);
		}
		this.budget=this.budget.replace(" ","");
	}
	LoadCategories()
	{
		this.httpClient.get<any>(this.source+'/api/GetCategories').subscribe(data => {
			for(var i=0;i<data.Categories.length;i++)
			{
				this.port={ID:data.Categories[i].ID, Name:data.Categories[i].CategoryName};
				this.Categories.push(this.port);	
			}
			console.log(this.Categories);
		},
		err => {
				console.log(err);	
		});
	}
	ModalActiv:boolean=false;
	launchLocationPage(){
		if(this.ModalActiv==false)
		{
			this.ModalActiv=true;
			let modal = this.modalCtrl.create(LocationSelect);	
			modal.onDidDismiss((location) => {
				this.ModalActiv=false;
				if(location)
				{
				this.address.location=location.location;
				this.address.street_name=location.street_name;
				this.address.state=location.state;
				this.address.code=location.code;
				this.address.postcode=location.postcode;
				this.address.longitude=location.longitude;
				this.address.latitude=location.latitude;
				}
			});
			modal.present();
		}
    }
	LoadSubCategories()
	{
		this.httpClient.post<any>(this.source+'/api/GetSubCategories',{ID:this.category.ID}).subscribe(data => {
			this.SubCategories=[];
			this.sub_category.ID=0;
			this.sub_category.Name="Select Subcategory";
			for(var i=0;i<data.SubCategories.length;i++)
			{
				this.port={ID: data.SubCategories[i].ID,Name:data.SubCategories[i].SubCategoryName};
				this.SubCategories.push(this.port);
			}
		},
		err => {
					
		});
	}
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
	GoNext()
	{
		if(this.ValidateWindow(this.slides.getActiveIndex())==true)
		{
			let index=this.slides.getActiveIndex()+1;
			this.slides.slideTo(index, 500);
			this.content.scrollToTop();
		}
		else
		{
			this.presentToast("Please fill up correctly");
		}
	}
	GoPrevious()
	{
		let index=this.slides.getActiveIndex()-1;
		this.slides.slideTo(index, 500);
		this.content.scrollToTop();
	}
	Close(){
		this.navCtrl.setRoot('TradiehomePage');
	}
	slideChanged()
	{
		//var index=this.slides.getActiveIndex();
		this.content.scrollToTop();
	}
	addItem() {
		let addModal = this.modalCtrl.create('ItemCreatePage');
		addModal.onDidDismiss(item => {
			if (item) {
				if(this.Photos.length<5)
				{
					this.Photos.push({upload:item.upload,file_description:item.file_description});
				}
			}
		})
		addModal.present();
	}
	mark_to_delete:string[]=[];
	DeletePhoto(index,id)
	{
		if(index!=100)
		{
			for(var i=index;i<this.Photos.length;i++)
			{
				if(i==this.Photos.length-1)
				{
					this.Photos.pop();
				}
				else
				{
					this.Photos[i]=this.Photos[i+1];
				}
			}
		}
		else
		{
			this.mark_to_delete.push(id);
			for(var k=0;k<this.UploadedPhotos.length;k++)
			{
				if(this.UploadedPhotos[k].id==id)
				{
					for(var j=k;j<this.UploadedPhotos.length;j++)
					{
						if(j!=this.UploadedPhotos.length-1)
						{
							this.UploadedPhotos[j]=this.UploadedPhotos[j+1];
						}
						else
						{
							this.UploadedPhotos.pop();
						}
					}
				}
			}
		}
	}
	ValidateWindow(index)
	{
		if(index==0)
		{
			if(this.category.Name!="" && this.sub_category.Name!="" && this.title!="" && this.description!="")
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else if(index==1)
		{
			if(this.job_location!="" && this.skills!="")
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else if(index==2)
		{
			if(this.payment_type!="" && this.budget!="")
			{
				if(this.payment_type=="hourly")
				{
					if(this.working_hour!="")
					{
						return true;
					}
					else
					{
						return false;
					}
				}
				else
				{
					return true;
				}
			}
			else
			{
				return false;
			}
		}
		else if(index==3)
		{
			if(this.job_location=="onsite")	
			{
				if(this.address.house_no!="" && this.address.street_name!="" && this.address.suberb!="" && this.address.state!="" && this.address.code!="")
				{
					return true;
				}
				else
				{
					return false;
				}
			}
			else
			{
				return true;
			}
		}
	}
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider, public imageViewerController:ImageViewerController)  {
	  this.LoadCategories();
	  if(this.navParams.get("project_id"))
	  {
		  this.project_id=this.navParams.get("project_id");
		  let loader:any = this.loadingCtrl.create({
		  spinner: "hide",
		  content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		  });
		  loader.present();
		  setTimeout(()=>{this.LoadJob(loader);},3000);
	  }
  }
  presentImage(myImage) {
    const imageViewer = this.imageViewerController.create(myImage);
    imageViewer.present();
  }
  presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }
	LoadJob(loader)
	{
		let scope=this;
		scope.httpClient.get<any>(this.source+'/api/GetProjectbasic/'+scope.navParams.get("project_id")).subscribe(data => {
			for(var i=0;i<scope.Categories.length;i++)
			{
				if(data.category==scope.Categories[i].ID)
				{
					scope.category={ID:data.category, Name:scope.Categories[i].Name};
					scope.LoadSubCategories();
					setTimeout(()=>{
						for(var j=0;j<scope.SubCategories.length;j++)
						{
							if(data.sub_category==scope.SubCategories[j].ID)
							{
								this.sub_category={ID:data.sub_category,Name:scope.SubCategories[j].Name};
							}
						}
					},1000);
				}
			}
			scope.title=data.title;
			scope.job_location=data.location_type;
			if(data.Address!=null)
			{
				scope.address.house_no=data.Address.house_no;
				scope.address.street_name=data.Address.street_name;
				scope.address.suberb=data.Address.suberb;
				scope.address.state=data.Address.state;
				scope.address.code=data.Address.code;
				scope.address.location=data.Address.location;
				scope.address.postcode=data.Address.postcode;
				scope.address.longitude=String(data.Address.longitude);
				scope.address.latitude=String(data.Address.latitude);
			}
			scope.est_date=data.est_date;
			scope.est_date_show=scope.commonProvider.GetFormattedDate(data.est_date);
			scope.description=data.description;
			scope.skills=data.skills;
			scope.payment_type=data.payment_mode;
			scope.budget=parseInt(data.estimate_budget);
			scope.working_hour=data.working_hour;
			if(data.Files!=null)
			{
				scope.Photos=[];
				for(var k=0;k<data.Files.length;k++)
				{
					scope.UploadedPhotos.push({id:data.Files[k].id, upload:"https://ptezone.com.au/project_uploads/"+data.Files[k].upload,file_description:data.Files[k].file_description});
				}
			}
			loader.dismiss();
		},
		err => {
				this.Error="";
				this.Error=JSON.stringify(err);	
				loader.dismiss();
		});
	}
	Submit()
	{
		if(this.title=="" || this.title==null)
		{
			this.presentToast("Please enter a title");
			return;
		}
		
		if(this.category.ID==0)
		{
			this.presentToast("Please select a category");
			return;
		}
		if(this.sub_category.ID==0)
		{
			this.presentToast("Please select a subcategory");
			return;
		}
		if(this.description=="" || this.description==null)
		{
			this.presentToast("Please enter a description");
			return;
		}
		if(this.skills=="" || this.skills==null)
		{
			this.presentToast("Please enter a skills");
			return;
		}
		if(this.budget=="" || this.budget==null)
		{
			this.presentToast("Please enter a budget");
			return;
		}
		if(this.payment_type=="hourly" && (this.working_hour=="" || this.working_hour==null))
		{
			this.presentToast("Please enter a estimated working hour");
			return;
		}
		if(this.ValidHours(this.working_hour)==false && this.payment_type=="hourly")
		{
			this.presentToast("Please enter valid working hours");
			return;
		}
		if(this.ValidMoney(this.budget)==false)
		{
			this.presentToast("Please enter valid budget");
			return;
		}
		if(this.job_location=="onsite" && (this.address.location=="" || this.address.location==null))
		{
			this.presentToast("Please enter a location");
			return;
		}
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		let postData={
			id:0,
			device_id:this.commonProvider.DeviceID,
			category:this.category.ID,
			sub_category:this.sub_category.ID,
			location_type:this.job_location,
			title:this.title,
			description:this.description,
			skills:this.skills,
			payment_mode:this.payment_type,
			estimate_budget:this.budget,
			working_hour:this.working_hour,
			location: this.address.location,
			
			house_no:this.address.house_no,
			street_name:this.address.street_name,
			suberb:this.address.suberb,
			state:this.address.state,
			code:this.address.code,
			longitude:this.address.longitude,
			latitude:this.address.latitude,
			photos:this.Photos,
			est_date: this.est_date,
			Photos: this.Photos,
			mark_to_delete:this.mark_to_delete
		}
		if(this.navParams.get("project_id"))
		{
			postData.id=this.navParams.get("project_id");
		}
		this.httpClient.post<any>(this.source+'/api/SaveProject',postData).subscribe(data => {
			loader.dismiss();
			this.Error="";
			
			if(this.project_id!=0)
			{
				this.presentToast("Your project is modified");
				//this.navCtrl.setRoot('ProjectdetailPage',{ProjectID:this.project_id, Mine: 1, Bids:1});
				this.navCtrl.pop();
			}
			else
			{
				this.presentToast("Your project is submitted");
				if(this.commonProvider.Role!="Admin" && this.commonProvider.Role!="Tradie")
				{
					this.navCtrl.setRoot('ContentPage');
				}
				else
				{
					this.navCtrl.setRoot('TradiehomePage');
				}
			}
		},
		err => {
				loader.dismiss();
				this.Error="";
				this.Error=JSON.stringify(err);	
		});
	}
	formatDate(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
	
		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
	
		return [year, month, day].join('-');
	}
	OpenCalender()
	{
		if(this.ModalActiv==false)
		{
			this.ModalActiv=true;
			let modal = this.modalCtrl.create("DatePickerPage");
	
			modal.onDidDismiss((date) => {
				this.ModalActiv=false;
				if(date)
				{
					this.est_date=this.formatDate(date);
					this.est_date_show=this.commonProvider.GetFormattedDate(date);
				}
			});
	
			modal.present();
		}			
	}
	ValidHours(hours)
	{
		if(hours!="")
		{
			var re = /^[1-9]\d*$/;
			if(!re.test(hours)) {
				return false;
			}
			else
			{
				return true;
			}
		}
		else
		{
			return true;
		}
	}
	ValidMoney(money)
	{
		if(money!="")
		{
			var re = /^[1-9]\d*$/;
			if(!re.test(money)) {
				return false;
			}
			else
			{
				return true;
			}
		}
		else
		{
			return true;
		}
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad JobpostPage');
  }

}
