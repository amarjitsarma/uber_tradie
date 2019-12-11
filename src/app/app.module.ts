import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StarRatingModule } from 'ionic3-star-rating';
import { SQLite } from '@ionic-native/sqlite';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { DocumentPicker } from '@ionic-native/document-picker';
//Calender
import { DatePickerModule } from 'ionic-calendar-date-picker';

//Location
import { Network } from '@ionic-native/network';
import { GoogleMaps } from '../providers/google-maps/google-maps';
import { ConnectivityServiceProvider } from '../providers/connectivity-service/connectivity-service';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationSelect } from '../pages/location-select/location-select';
//Location
import { Items } from '../mocks/providers/items';
import { Settings } from '../providers/providers';
import { User } from '../providers/providers';
import { Api } from '../providers/providers';
import { MyApp } from './app.component';
import { Device } from '@ionic-native/device';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';

import { JoblistPage } from '../pages/joblist/joblist';
import { CardsPage } from '../pages/cards/cards';
import { Freelancelist1Page } from '../pages/freelancelist1/freelancelist1';
import { Freelancelist7Page } from '../pages/freelancelist7/freelancelist7';
import { Freelancelist8Page } from '../pages/freelancelist8/freelancelist8';
import { TradiebasicPage } from '../pages/tradiebasic/tradiebasic';
import { TradieadvancePage } from '../pages/tradieadvance/tradieadvance';
import { JobpostPage } from '../pages/jobpost/jobpost';
import { CommondataProvider } from '../providers/commondata/commondata';
import { TradieproviderProvider } from '../providers/tradieprovider/tradieprovider';
import { JobproProvider } from '../providers/jobpro/jobpro';

import { IonicImageViewerModule } from 'ionic-img-viewer';
import {NgxImageCompressService} from 'ngx-image-compress';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Stripe } from '@ionic-native/stripe';

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
	JoblistPage,
	CardsPage,
	Freelancelist1Page,
	Freelancelist7Page,
	Freelancelist8Page,
	TradiebasicPage,
	JobpostPage,
	LocationSelect,
	TradieadvancePage
  ],
  imports: [
	IonicImageViewerModule,
	StarRatingModule,
	DatePickerModule,
	SelectSearchableModule,
	IonicSelectableModule,
    BrowserModule,
	BrowserAnimationsModule,
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
	JoblistPage,
	CardsPage,
	Freelancelist1Page,
	Freelancelist7Page,
	Freelancelist8Page,
	TradiebasicPage,
	JobpostPage,
	LocationSelect,
	TradieadvancePage
  ],
  providers: [
    Api,
    Items,
    User,
    Camera,
    SplashScreen,
    StatusBar,
	Device,
	SQLite,
	FileTransfer,
	FileChooser,
	FilePath,
	File,
	DocumentPicker,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConnectivityServiceProvider,
	GoogleMaps,
	Geolocation,
	Network,
    CommondataProvider,
    TradieproviderProvider,
    JobproProvider,
	NgxImageCompressService,
	Diagnostic,
	Stripe
  ]
})
export class AppModule { }
