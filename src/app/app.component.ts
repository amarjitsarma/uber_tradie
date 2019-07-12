import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';

import { FirstRunPage } from '../pages/pages';
import { Freelancelist1Page } from '../pages/freelancelist1/freelancelist1';
import { Freelancelist2Page } from '../pages/freelancelist2/freelancelist2';
import { Freelancelist3Page } from '../pages/freelancelist3/freelancelist3';
import { Freelancelist4Page } from '../pages/freelancelist4/freelancelist4';
import { Freelancelist5Page } from '../pages/freelancelist5/freelancelist5';
import { Freelancelist6Page } from '../pages/freelancelist6/freelancelist6';
import { Freelancelist7Page } from '../pages/freelancelist7/freelancelist7';
import { Freelancelist8Page } from '../pages/freelancelist8/freelancelist8';
import { Settings } from '../providers/providers';

@Component({
  template: `<ion-menu [content]="content">

    <ion-content class="card-background-page">
		<ion-card>
			<img src="assets/img/profile_bg.jpg"/>
			<div class="card-title">Amarjit Sarma</div>
			<div class="card-subtitle">Melbourne, Australia</div>
			<div class="card-subtitle"><button ion-button clear color="light"><ion-icon name="create"></ion-icon> View Profile</button></div>
		</ion-card>
      <ion-list class="menu-list">
        <button menuClose ion-item class="menu-buttons" *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Home', component: 'TutorialPage' },
    { title: 'Categories', component: 'WelcomePage' },
    { title: 'Tasks', component: 'TabsPage' },
    { title: 'Terms & Conditions', component: 'CardsPage' },
    { title: 'Privacy Policy', component: 'ContentPage' },
    { title: 'My Posts', component: 'WelcomePage' },
	{ title: 'My Tasks', component: 'WelcomePage' }
  ]

  constructor(private translate: TranslateService, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();
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
}
