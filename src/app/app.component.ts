import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { JoblistPage } from '../pages/joblist/joblist';
import { CardsPage } from '../pages/cards/cards';
import { FirstRunPage } from '../pages/pages';
import { Settings } from '../providers/providers';
import { Freelancelist1Page } from '../pages/freelancelist1/freelancelist1';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommondataProvider } from '../providers/commondata/commondata';
import { TradieproviderProvider } from '../providers/tradieprovider/tradieprovider';
import { Network } from '@ionic-native/network';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
/*import { TradieadvancePage } from '../pages/tradieadvance/tradieadvance';
import { TradiebasicPage } from '../pages/tradiebasic/tradiebasic';*/
import { JobpostPage } from '../pages/jobpost/jobpost';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { JobproProvider } from '../providers/jobpro/jobpro';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = FirstRunPage;//CardsPage;

  @ViewChild(Nav) nav: Nav;
	DeviceID:string="534b8b5aeb906015";
	User:any={
		avatar: '',
		created_at: '',
		dob: '',
		email: '',
		first_name: '',
		id: 0,
		last_login: '',
		last_name: '',
		password: '',
		permissions: '',
		phone: '',
		status: 0,
		updated_at: '',
		username: ''
	};
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  pages: any[] = [
    { title: 'Home', component: 'TradiehomePage', icon:'home' },
    { title: 'Categories', component: 'CategorylistPage', icon:'copy' },
    { title: 'Tasks', component: JoblistPage, icon:'clipboard' },
    { title: 'Tradies', component: CardsPage, icon:'people' },
    { title: 'Privacy Policy', component: 'PrivacyPage', icon:'paper' },
    { title: 'My Posts', component: 'MypostsPage', icon:'pricetags' },
	{ title: 'My Tasks', component: 'MytasksPage', icon:'attach' },
	{ title: 'My Bids', component: 'MybidsPage', icon:'chatboxes' },
	{ title: 'My Quotes', component: 'QuotelistPage', icon:'quote' },
	{ title: 'Reviews', component: 'ReviewmainPage', icon:'star' },
	{ title: 'Change Password', component: 'UpdatepasswordPage', icon:'lock' }
	
  ];
  Error:string="";
	Internet:boolean=false;
	presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }
   counter:any=0;
  constructor(private translate: TranslateService, public platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen, public httpClient:HttpClient, public device:Device, public sqlite: SQLite, public commonProvider:CommondataProvider, public tradieproviderProvider:TradieproviderProvider, public network: Network, public loadingCtrl: LoadingController, public toastCtrl:ToastController, public diagnostic: Diagnostic, public geolocation:Geolocation, public jobproProvider:JobproProvider, public alertCtrl: AlertController, private locationAccuracy: LocationAccuracy) {
	  this.tradieproviderProvider.LoadMyLocation();
	   this.jobproProvider.LoadMyLocation();
		this.platform.ready().then(() => {
			this.commonProvider.GetDeviceID();
			/*this.diagnostic.isLocationEnabled(data=>{
				alert(JSON.stringify(data));
			},
			error=>{
				alert(JSON.stringify(error));
			});*/
			
			let watch = this.geolocation.watchPosition();
			watch.subscribe((data) => {
				this.tradieproviderProvider.location={location:'My Location',longitude:data.coords.longitude, latitude:data.coords.latitude};
			});
		
		
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.CheckLogin();
			//returns view controller obj
			
			this.initializeNetworkEvents();
			this.platform.registerBackButtonAction(() => {
				let view=this.nav.getActive().id;
				if(view == 'TradiehomePage' || view== 'ContentPage' || view== 'WelcomePage' || view=="AdminhomePage")
				{
					if (this.counter == 0) {
						this.counter++;
						this.presentToast("Press the back button again to exit.");
						setTimeout(() => { this.counter = 0 }, 3000)
					} else {
						// console.log("exitapp");
						this.platform.exitApp();
					}
				}
				else
				{
					try
					{
						this.nav.pop();
					}
					catch(err){}
				}
				
			}, 0);
		});
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		this.initTranslate();
		let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
			loader = this.loadingCtrl.create({
			spinner: "hide",
			content: `<div class="custom-spinner-container">
							<div class="custom-spinner-box">
								<img src="assets/img/spinner.gif" width="100%"/>
							</div>
						</div>`
			});
			loader.present();
			this.presentToast('Network is disconnected. Please reconnect to continue.');
		});
		
		
		// watch network for a connection
		let connectSubscription = this.network.onConnect().subscribe(() => {
			loader.dismiss();
		});
		setTimeout(()=>{
			this.CheckLocationStatus();
		},2000);
	}
	CheckLocationStatus()
	{
		this.locationAccuracy.canRequest().then((canRequest: boolean) => {

			if(canRequest) {
				// the accuracy option will be ignored by iOS
				this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
				() => console.log("Thank you. Location turned on successfully"),
				error => alert('Location is not turned on, you may face difficulty.')
				);
			}
			
		});
	}
	initializeNetworkEvents(): void {
        this.network.onDisconnect().subscribe(() => {
           this.Internet=false;
        });
        this.network.onConnect().subscribe(() => {
           this.Internet=true;
        });
    }
	MakeString(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
	RetrieveUserData()
	{
		let scope=this;
		return new Promise(function(resolve,reject) {
			scope.commonProvider.GetLoginDetails(scope.commonProvider.DeviceID);
			resolve();
		});
	}
	CheckLogin()
	{
		let scope=this;
		scope.RetrieveUserData().then(()=>{setTimeout(() => {
				scope.CheckLoginFinal();
			}, 1000);})
		.catch(err=>{});
	}
	CheckLoginFinal()
	{
		let scope=this;
		scope.User=scope.commonProvider.User;
		if(scope.commonProvider.Role=="Tradie")
		{
			scope.pages=[
				{ title: 'Home', component: 'TradiehomePage', icon:'home' },
				{ title: 'Bid Project', component: JoblistPage, icon:'pricetags' },
				{ title: 'My Posts', component: 'MytasksPage', icon:'clipboard' },
				{ title: 'Post Project', component: JobpostPage, icon:'copy' },
				{ title: 'Messages', component: 'QuotelistPage', icon:'mail' },
				{ title: 'Search Tradie', component: CardsPage, icon:'people' },
				{ title: 'Documents', component: 'FlfilesPage', icon:'document' },
				{ title: 'Reviews', component: 'ReviewmainPage', icon:'star' },
				{ title: 'Transactions', component: 'AdminpaymentPage', icon:'quote' },
				{ title: 'Change Password', component: 'UpdatepasswordPage', icon:'lock' }
			];
			this.commonProvider.LoadBasic();
			//this.commonProvider.LoadWorkingHours();
			this.commonProvider.LoadContact();
			//this.commonProvider.LoadPhotos();
			this.commonProvider.LoadAbout();
			this.commonProvider.LoadSkills();
			this.commonProvider.LoadBank();
			
			//this.commonProvider.LoadService();
			//this.commonProvider.LoadTaglines();
			//this.commonProvider.LoadKeywords();
		}
		else if(scope.commonProvider.Role=="Admin")
		{
			scope.pages= [
				{ title: 'Update Details', component: 'EditprofilePage', icon:'person' },
				{ title: 'Manage Tradie', component: 'ManagetradiePage', icon:'people' },
				{ title: 'Manage Customer', component: 'AdmincustomerPage', icon:'people' },
				{ title: 'Manage Admin', component: 'AdminadminPage', icon:'person' },
				{ title: 'Manage Payment', component: 'AdminpaymentPage', icon:'cash' },
				{ title: 'Manage Settings', component: 'AdminsettingPage', icon:'settings' },
				{ title: 'Change Password', component: 'UpdatepasswordPage', icon:'lock' }
			];
		}
		else
		{
			scope.pages= [
				{ title: 'Home', component: 'ContentPage', icon:'home' },
				{ title: 'Categories', component: 'CategorylistPage', icon:'copy' },
				{ title: 'Tradies', component: CardsPage, icon:'people' },
				{ title: 'Privacy Policy', component: 'PrivacyPage', icon:'paper' },
				{ title: 'My Posts', component: 'MypostsPage', icon:'pricetags' },
				{ title: 'Reviews', component: 'ReviewmainPage', icon:'star' },
				{ title: 'Transactions', component: 'AdminpaymentPage', icon:'quote' },
				{ title: 'Change Password', component: 'UpdatepasswordPage', icon:'lock' }
			];
		}
	}
  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    }
    else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
	if(page.component=='TradiehomePage' || page.component =='WelcomePage')
	{
		this.nav.setRoot(page.component);
	}
	else
	{
		this.nav.push(page.component);
	}
  }
  EditProfile()
  {
	  this.nav.push('EditprofilePage');
  }
	showConfirm() {
		const confirm = this.alertCtrl.create({
		title: 'Confirm!',
		message: 'Are you sure want to logout and exit?',
		buttons: [
			{
				text: 'Not now',
				handler: () => {
					//return false;
				}
			},
			{
				text: 'Logout & Exit',
				handler: () => {
					this.Logout();
				}
			}
		]
		});
		confirm.present();
	}
	Logout()
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
		this.httpClient.post<any>(this.source+'/api/logout',{
			DeviceID:this.commonProvider.DeviceID
		})
		.subscribe(data => {
			this.commonProvider.Status=0;
			this.commonProvider.User=null;
			this.commonProvider.Role="";
			this.commonProvider.tradie_basic={
				id:0,
				category:0,
				sub_category:0,
				fullname:"",
				ABN:"",
				location:"",
				house_no:"",
				street_name:"",
				suburb:"",
				state:"",
				code:"",
				postcode:"",
				longitude:0,
				latitude:0,
				radius:0,
				CategoryName:"",
				SubCategoryName:""
			};
			this.commonProvider.about={
				short_desc:"",
				about:""
			};
			this.tradieproviderProvider.ResetLocation();
			this.jobproProvider.ResetLocation();
			setTimeout(()=>{
				loader.dismiss();
				this.platform.exitApp();
				this.nav.setRoot("WelcomePage",{loader:false});
			},3000);
			
		},
		err => {
			loader.dismiss();
		})
	}
}
