import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { JoblistPage } from '../joblist/joblist';
import { JobpostPage } from '../jobpost/jobpost';
import { CardsPage } from '../cards/cards';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { TradieproviderProvider } from '../../providers/tradieprovider/tradieprovider';
import { MyApp } from '../../app/app.component';
/**
 * Generated class for the TradiehomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tradiehome',
  templateUrl: 'tradiehome.html',
})
export class TradiehomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public commonProvider:CommondataProvider, public myApp:MyApp, public tradieproviderProvider: TradieproviderProvider) {
	  this.myApp.CheckLogin();
	  this.tradieproviderProvider.LoadMyLocation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TradiehomePage');
	this.myApp.CheckLogin();
  }
	Goto(Page)
	{
		if(Page=="Jobs")
		{
			this.navCtrl.push(JoblistPage);
		}
		else if(Page=="MyJobs")
		{
			this.navCtrl.push("MytasksPage");
		}
		else if(Page=="PostJob")
		{
			this.navCtrl.push(JobpostPage);
		}
		else if(Page=="Messages")
		{
			this.navCtrl.push("QuotelistPage");
		}
		else if(Page=="Tradies")
		{
			this.navCtrl.push(CardsPage);
		}
		else if(Page=="Reviews")
		{
			this.navCtrl.push("ReviewmainPage");
		}
		else if(Page=="Transaction")
		{
			this.navCtrl.push("AdminpaymentPage");
		}		
	}
}
