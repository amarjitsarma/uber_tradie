import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, MenuController, LoadingController, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { LocationSelect } from '../location-select/location-select';
import { MyApp } from '../../app/app.component';
import { TradiebasicPage } from '../tradiebasic/tradiebasic';
import { TradieadvancePage } from '../tradieadvance/tradieadvance';
import { IonicSelectableComponent } from 'ionic-selectable';
/**
 * Generated class for the EditprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
class PortMT {
    public ID: number;
	public CategoryID: number;
    public Name: string;
}

@IonicPage()
@Component({
  selector: 'page-managetradie',
  templateUrl: 'managetradie.html',
})
export class ManagetradiePage {
	SubCategories:PortMT[]=[];
	port:PortMT;
	sub_category:PortMT[]=[];
	Tradies:any[]=[];
	Pagers:any[]=[];
	pager:any;
	status:any=2;
	search_result:any=0;
	search:{name:string,min_balance:any,max_balance:any}={name:"",min_balance:'',max_balance:''};
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient:HttpClient, public device:Device, public toastCtrl: ToastController, public sqlite: SQLite, public platform: Platform, public commonProvider: CommondataProvider, public menuController:MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
	  this.LoadSubCategories();
	  //this.LoadTradies();
  }
	LoadSubCategories()
	{
		this.SubCategories=[];
		this.httpClient.post<any>(this.source+'/api/GetSubCategories',{ID:0}).subscribe(data => {
			
			this.sub_category=[];
			for(var i=0;i<data.SubCategories.length;i++)
			{
				this.port={ID: data.SubCategories[i].ID, CategoryID: data.SubCategories[i].CategoryID, Name:data.SubCategories[i].SubCategoryName};
				this.SubCategories.push(this.port);
			}
		},
		err => {
					
		});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad ManagetradiePage');
  }
	LoadTradies()
	{
		
		this.Tradies=[];
		let post_data={
			name:this.search.name,
			skills:this.sub_category,
			min_balance:this.search.min_balance,
			max_balance:this.search.max_balance,
			status:this.status
		};
		this.httpClient.post<any>(this.source+'/api/GetFreelancersAdmin',post_data).subscribe(data => {
			this.search_result=1;
			this.Tradies=data;
			if(this.Tradies.length>10)
			{
				for(var i=0;i<this.Tradies.length;i=i+10)
				{
					this.Pagers.push({value:String(i+1)+"-"+String(i+10), text:String(i+1)+"-"+String(i+10)});
					this.pager=String(i+1)+"-"+String(i+10);
				}
			}
			else
			{
				this.Pagers=[];
				this.pager=null;
			}
		},
		err => {
					
		});
	}
	ViewProfile(id)
	{
		this.navCtrl.push('ItemDetailPage',{id:id});
	}
	Search()
	{
		
	}
	keyUpCheckerMinBalance(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.search.min_balance= elementChecker.slice(0, -1);
		}
		this.search.min_balance=this.search.min_balance.replace(" ","");
	}
	keyUpCheckerMaxBalance(ev) {
		let elementChecker: any;
		elementChecker = ev.target.value;
		if (isNaN(elementChecker)) {
			this.search.max_balance= elementChecker.slice(0, -1);
		}
		this.search.max_balance=this.search.max_balance.replace(" ","");
	}
}
