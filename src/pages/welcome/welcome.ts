import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, MenuController, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
	DeviceID:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public device:Device, public httpClient:HttpClient, public menuController:MenuController, public toastCtrl: ToastController, public sqlite: SQLite, public platform: Platform, public commonProvider:CommondataProvider, public loadingCtrl: LoadingController, public myApp: MyApp, public modalController:ModalController) {
	  this.menuController.swipeEnable(false);
	  
	  let scope=this;
	  if(!scope.navParams.get("loader"))
	  {
		  if(scope.navParams.get("loader")!=false)
		  {
			  scope.checklogin();
		  }
	  }
	  scope.commonProvider.SetFirst();
	 
	  
  }
  
  presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }
  login(type) {
	  this.navCtrl.push('LoginPage');
  }

  signup() {
	  this.navCtrl.push('Signup1Page');
  }
	
  checklogin()
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
		this.RetrieveUserData().then(()=>{
			setTimeout(()=>{
				if(this.commonProvider.Status!=0)
				{
					loader.dismiss();
					this.myApp.CheckLogin();
					if(this.commonProvider.User.Role=="Tradie")
					{
						this.navCtrl.setRoot("TradiehomePage");
					}
					else if(this.commonProvider.Role=="Admin")
					{
						this.navCtrl.setRoot("AdminhomePage");
					}
					else
					{
						this.navCtrl.setRoot("ContentPage");
					}
				}
				else
				{
					loader.dismiss();
				}
			},3000);
		});

  }
  RetrieveUserData()
  {
	  let scope=this;
	  return new Promise(function(resolve,reject) {
			scope.commonProvider.GetLoginDetails(scope.commonProvider.DeviceID);
			resolve();
		});
  }
}
