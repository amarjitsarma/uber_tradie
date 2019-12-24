import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { CommondataProvider } from '../commondata/commondata';
/*
  Generated class for the TradieproviderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TradieproviderProvider {
	location:any={
		location:'',
		longitude:0,
		latitude:0,
	};
	constructor(public http: HttpClient, public geolocation:Geolocation, public platform: Platform, public commonProvider: CommondataProvider) {
		this.LoadMyLocation();
		console.log('Hello TradieproviderProvider Provider');
		if(this.commonProvider.Role=="Tradie")
		{
			this.location={location:this.commonProvider.tradie_basic.location,longitude:this.commonProvider.tradie_basic.longitude, latitude:this.commonProvider.tradie_basic.latitude};
		}
		else
		{
			let watch = this.geolocation.watchPosition();
			watch.subscribe((data) => {
				this.location={location:'My Location',longitude:data.coords.longitude, latitude:data.coords.latitude};
			});
		}
	}
	LoadMyLocation()
	{
		if(this.commonProvider.Role=="Tradie")
		{
			this.location={location:this.commonProvider.tradie_basic.location,longitude:this.commonProvider.tradie_basic.longitude, latitude:this.commonProvider.tradie_basic.latitude};
		}
		else
		{
			this.geolocation.getCurrentPosition().then((resp) => {
				this.location={location:'My Location',longitude:resp.coords.longitude, latitude:resp.coords.latitude};
			}).catch((error) => {
				
			});	
		}
	}
  ResetLocation()
  {
	  this.location={location:'',longitude:0,latitude:0};
  }

}
