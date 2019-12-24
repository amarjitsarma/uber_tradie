import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { CommondataProvider } from '../commondata/commondata';
@Injectable()
export class JobproProvider {
	location:any={
		location:'',
		longitude:0,
		latitude:0,
	};
	constructor(public http: HttpClient, public geolocation:Geolocation, public commonProvider: CommondataProvider) {
		this.LoadMyLocation();
		if(this.commonProvider.Role=="Tradie")
		{
			this.location={location:this.commonProvider.tradie_basic.location,longitude:this.commonProvider.tradie_basic.longitude, latitude:this.commonProvider.tradie_basic.latitude};
		}
		else
		{
			let watch = this.geolocation.watchPosition();
			watch.subscribe((data) => {
				if(this.commonProvider.Role!="Tradie")
				{
					this.location={location:'My Location',longitude:data.coords.longitude, latitude:data.coords.latitude};
				}
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
}
