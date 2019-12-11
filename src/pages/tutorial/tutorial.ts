import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform, LoadingController, ToastController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import { ContentPage } from '../content/content';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;
  dir: string = 'ltr';
  Load:boolean=true;

  constructor(public navCtrl: NavController, public menu: MenuController, translate: TranslateService, public platform: Platform, public toastCtrl: ToastController, public commonProvider: CommondataProvider, public myApp: MyApp, public loadingCtrl: LoadingController,) {
	  let scope=this;
		scope.First().then(()=>{
			setTimeout(()=>{
				scope.Load=false;
				if(this.commonProvider.First!=0)
				{
					scope.RetrieveUserData();
					scope.commonProvider.GetDeviceIDWelcome();
					this.navCtrl.setRoot("WelcomePage");
				}
			},1000);
		});
    this.dir = platform.dir();
    translate.get(["TUTORIAL_SLIDE1_TITLE",
      "TUTORIAL_SLIDE1_DESCRIPTION",
      "TUTORIAL_SLIDE2_TITLE",
      "TUTORIAL_SLIDE2_DESCRIPTION",
      "TUTORIAL_SLIDE3_TITLE",
      "TUTORIAL_SLIDE3_DESCRIPTION",
    ]).subscribe(
      (values) => {
        console.log('Loaded values', values);
        this.slides = [
          {
            title: values.TUTORIAL_SLIDE1_TITLE,
            description: values.TUTORIAL_SLIDE1_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-1.png',
          },
          {
            title: values.TUTORIAL_SLIDE2_TITLE,
            description: values.TUTORIAL_SLIDE2_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-2.png',
          },
          {
            title: values.TUTORIAL_SLIDE3_TITLE,
            description: values.TUTORIAL_SLIDE3_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-3.png',
          }
        ];
      });
  }
	presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }
  startApp() {
    this.navCtrl.setRoot('WelcomePage', {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
  checklogin()
  {
	if(this.commonProvider.Status!=0)
		{
			this.myApp.CheckLogin();
			if(this.commonProvider.User.Role=="Tradie" || this.commonProvider.Role=="Admin")
			{
				this.navCtrl.setRoot("TradiehomePage");
			}
			else
			{
				this.navCtrl.setRoot("ContentPage");
			}
		}

  }
  First()
  {
	  let scope=this;
	  scope.commonProvider.GetFirst();
	  return new Promise(function(resolve,reject) {
			resolve();
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
