import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
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
  constructor(public http: HttpClient, public geolocation:Geolocation, public platform: Platform) {
	  this.LoadMyLocation();
		console.log('Hello TradieproviderProvider Provider');
		let watch = this.geolocation.watchPosition();
		watch.subscribe((data) => {
			if(this.location.location=="")
			{
				this.location={location:'My Location',longitude:data.coords.longitude, latitude:data.coords.latitude};
				alert("test");
			}
		});
  }
  LoadMyLocation()
  {
	  this.geolocation.getCurrentPosition().then((resp) => {
		  this.location={location:'My Location',longitude:resp.coords.longitude, latitude:resp.coords.latitude};
		}).catch((error) => {
		});
		
  }
  ResetLocation()
  {
	  this.location={location:'',longitude:0,latitude:0};
  }

}
