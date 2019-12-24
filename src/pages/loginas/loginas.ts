import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, MenuController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { HttpClient } from '@angular/common/http';
import { FirstRunPage } from '../pages';
import { Freelancelist1Page } from '../freelancelist1/freelancelist1';
import { User } from '../../providers/providers';
import { MainPage } from '../pages';
@IonicPage()
@Component({
  selector: 'page-loginas',
  templateUrl: 'loginas.html',
})
export class LoginasPage {

  DeviceID:string="";
  source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
	public device:Device,
	public httpClient:HttpClient,
	public menuController:MenuController) {
		this.checklogin();
		
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginasPage');
  }
	User()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		this.httpClient.post<any>(this.source+'/api/UpdateLoginType',{
			DeviceID:this.DeviceID,
			LoginType:1
		})
		.subscribe(data => {
			location.reload();
		},
		err => {
			
		})
	}
	Tradie()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		this.httpClient.post<any>('https://ptezone.com.au/api/UpdateLoginType',{
			DeviceID:this.DeviceID,
			LoginType:2
		})
		.subscribe(data => {
			location.reload();
		},
		err => {
			
		})
	}
	checklogin()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		this.httpClient.post<any>(this.source+'/api/CheckLogin',{
			DeviceID:this.DeviceID
		})
		.subscribe(data => {
			if(data.Status==1 && (data.Type==1 || data.Type==2))
			{
				if(data.User.Tradie==null && data.Type==2)
				{
					this.navCtrl.setRoot(Freelancelist1Page);
				}
				else
				{
					this.navCtrl.setRoot('ContentPage');
				}
			}
		},
		err => {
			
		})

  }
}
