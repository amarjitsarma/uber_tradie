import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { FirstRunPage } from '../pages';
import { SelectSearchableComponent } from 'ionic-select-searchable';

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
	
	Categories:JobPort1[]=[];
	SubCategories:JobPort1[]=[];
	port:JobPort1={ID:0,Name:""};
	category:JobPort1={ID:0,Name:""};
	sub_category:JobPort1={ID:0,Name:""};
	title:string="";
	description:string="";
	job_location:string="online";
	skills:string="";
	payment_type:string="full";
	budget:any="";
	working_hour:any="";
	address:{house_no:string, street_name:string, suberb:string, state:string, code:string}={
		house_no:"",
		street_name:"",
		suberb:"",
		state:"",
		code:""
	}
	DeviceID:string="";
	portChange(event: {
        component: SelectSearchableComponent,
        value: any 
    }) {
		if(this.category.Name!="")
		{
			this.LoadSubCategories();
		}
    }
	LoadCategories()
	{
		this.httpClient.get<any>('http://uber.ptezone.com.au/api/GetCategories').subscribe(data => {
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
	LoadSubCategories()
	{
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/GetSubCategories',{ID:this.category.ID}).subscribe(data => {
			this.SubCategories=[];
			this.sub_category.ID=0;
			this.sub_category.Name="";
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
			this.ShowAlert("Error","Please fill up correctly");
		}
	}
	GoPrevious()
	{
		let index=this.slides.getActiveIndex()-1;
		this.slides.slideTo(index, 500);
		this.content.scrollToTop();
	}
	Close(){
		this.navCtrl.setRoot(FirstRunPage);
	}
	slideChanged()
	{
		var index=this.slides.getActiveIndex();
		this.content.scrollToTop();
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl : ModalController, public device: Device)  {
	  this.LoadCategories();
  }
	Submit()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		
		let postData={
			device_id:this.DeviceID,
			category:this.category.ID,
			sub_category:this.sub_category.ID,
			location_type:this.job_location,
			title:this.title,
			description:this.description,
			skills:this.skills,
			payment_mode:this.payment_type,
			estimate_budget:this.budget,
			working_hour:this.working_hour,
			house_no:this.address.house_no,
			street_name:this.address.street_name,
			suberb:this.address.suberb,
			state:this.address.state,
			code:this.address.code
		}
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/SaveProject',postData).subscribe(data => {
			this.ShowAlert("Success","Your project is submitted");
			this.navCtrl.setRoot(FirstRunPage);
		},
		err => {
				console.log(err);	
		});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad JobpostPage');
  }

}
