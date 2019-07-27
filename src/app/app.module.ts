import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Items } from '../mocks/providers/items';
import { Settings } from '../providers/providers';
import { User } from '../providers/providers';
import { Api } from '../providers/providers';
import { MyApp } from './app.component';
import { Device } from '@ionic-native/device';
import { SelectSearchableModule } from 'ionic-select-searchable';

//Pages
import { Freelancelist1Page } from '../pages/freelancelist1/freelancelist1';
import { Freelancelist2Page } from '../pages/freelancelist2/freelancelist2';
import { Freelancelist3Page } from '../pages/freelancelist3/freelancelist3';
import { Freelancelist4Page } from '../pages/freelancelist4/freelancelist4';
import { Freelancelist5Page } from '../pages/freelancelist5/freelancelist5';
import { Freelancelist6Page } from '../pages/freelancelist6/freelancelist6';
import { Freelancelist7Page } from '../pages/freelancelist7/freelancelist7';
import { Freelancelist8Page } from '../pages/freelancelist8/freelancelist8';
import { CardsPage } from '../pages/cards/cards';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { JobpostPage } from '../pages/jobpost/jobpost';
import { JoblistPage } from '../pages/joblist/joblist';
import { ProjectdetailPage } from '../pages/projectdetail/projectdetail';
import { BidformPage } from '../pages/bidform/bidform';
import { CategorylistPage } from '../pages/categorylist/categorylist';
import { SubcategorylistPage } from '../pages/subcategorylist/subcategorylist';
import { QuoteformPage } from '../pages/quoteform/quoteform';
import { QuotelistPage } from '../pages/quotelist/quotelist';
import { QuotedetailPage } from '../pages/quotedetail/quotedetail';
// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
	Freelancelist1Page,
	Freelancelist2Page,
	Freelancelist3Page,
	Freelancelist4Page,
	Freelancelist5Page,
	Freelancelist6Page,
	Freelancelist7Page,
	Freelancelist8Page,
	CardsPage,
	ItemDetailPage,
	JobpostPage,
	JoblistPage,
	ProjectdetailPage,
	BidformPage,
	CategorylistPage,
	SubcategorylistPage,
	QuoteformPage,
	QuotelistPage,
	QuotedetailPage
  ],
  imports: [
	SelectSearchableModule,
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
	Freelancelist1Page,
	Freelancelist2Page,
	Freelancelist3Page,
	Freelancelist4Page,
	Freelancelist5Page,
	Freelancelist6Page,
	Freelancelist7Page,
	Freelancelist8Page,
	CardsPage,
	ItemDetailPage,
	JobpostPage,
	JoblistPage,
	ProjectdetailPage,
	BidformPage,
	CategorylistPage,
	SubcategorylistPage,
	QuoteformPage,
	QuotelistPage,
	QuotedetailPage
  ],
  providers: [
    Api,
    Items,
    User,
    Camera,
    SplashScreen,
    StatusBar,
	Device,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
