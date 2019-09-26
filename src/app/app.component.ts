import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { JoblistPage } from '../pages/joblist/joblist';
import { CardsPage } from '../pages/cards/cards';
import { FirstRunPage } from '../pages/pages';
import { Settings } from '../providers/providers';
import { Freelancelist1Page } from '../pages/freelancelist1/freelancelist1';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;
	DeviceID:string="";
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
  pages: any[] = [
    { title: 'Home', component: 'ContentPage', icon:'home' },
    { title: 'Categories', component: 'CategorylistPage', icon:'copy' },
    { title: 'Tasks', component: JoblistPage, icon:'clipboard' },
    { title: 'Tradies', component: CardsPage, icon:'people' },
    { title: 'Privacy Policy', component: 'PrivacyPage', icon:'paper' },
    { title: 'My Posts', component: 'MypostsPage', icon:'pricetags' },
	{ title: 'My Tasks', component: 'MytasksPage', icon:'attach' },
	{ title: 'My Bids', component: 'MybidsPage', icon:'chatboxes' },
	{ title: 'My Quotes', component: 'QuotelistPage', icon:'quote' }
  ]

  constructor(private translate: TranslateService, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen, public httpClient:HttpClient, public device:Device) {
    platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();
	this.CheckLogin();
  }
	CheckLogin()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		this.httpClient.post<any>('http://uber.ptezone.com.au/api/CheckLogin',{
			DeviceID:this.DeviceID
		})
		.subscribe(data => {
			console.log(data);
			this.User=data.User;
		},
		err => {
			
		})
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
    this.nav.setRoot(page.component);
  }
  EditProfile()
  {
	  this.nav.setRoot('EditprofilePage');
  }
}
