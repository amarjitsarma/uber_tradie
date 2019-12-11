import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-date-picker',
  templateUrl: 'date-picker.html',
})
export class DatePickerPage {
	isReadyToSave: boolean=false;
	date:any="";
	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
		this.isReadyToSave=false;
	}
	dateSelected(date)
	{
		var d = new Date(date);
		var d1=new Date();
		if(d <= d1 && !this.navParams.get("transaction"))
		{
			alert("Invalid date. Select a date later than today");
			this.isReadyToSave=false;
		}
		else
		{
			this.date=date;
			this.isReadyToSave=true;
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DatePickerPage');
	}
	done() 
	{
		this.viewCtrl.dismiss(this.date);
	}
	cancel() {
		this.viewCtrl.dismiss();
	}

}