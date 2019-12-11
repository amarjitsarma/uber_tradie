import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
@Injectable()
export class JobproProvider {
	location:any={
		location:'',
		longitude:0,
		latitude:0,
	};
  constructor(public http: HttpClient, public geolocation:Geolocation) {
	  this.LoadMyLocation();
		console.log('Hello TradieproviderProvider Provider');
		let watch = this.geolocation.watchPosition();
		watch.subscribe((data) => {
			if(this.location.location=="")
			{
				this.location={location:'My Location',longitude:data.coords.longitude, latitude:data.coords.latitude};
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
