import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
/**
 * Generated class for the Businesslist7Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
class Port1 {
    public DistrictID: number;
    public DistrictName: string;
}
@IonicPage()
@Component({
  selector: 'page-freelancelist7',
  templateUrl: 'freelancelist7.html',
})
export class Freelancelist7Page {
	Services:any=[];
	SubCategories:any=[];
	Services1:Port1[]=[];
	SearchBusiness:any="";
	Districts:Port1[]=[];
	District:any="";
	Cities:Port1[]=[];
	City:any="";
	ports: Port1[]=[];
    port: Port1;
	
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Freelancelist7Page');
  }

}
