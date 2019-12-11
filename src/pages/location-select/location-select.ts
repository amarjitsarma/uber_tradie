import {Component, NgZone, ViewChild} from '@angular/core';
import {ViewController, LoadingController, ToastController, Searchbar } from 'ionic-angular';
declare var google: any;

@Component({
  selector: 'page-location-select',
  templateUrl: 'location-select.html'
})

export class LocationSelect {
	 @ViewChild('searchbar') searchbar:Searchbar;
	location:any = {
            longitude: null,
            latitude: null,
            location: '',
			street_name:'',
			state:'',
			postcode:'00000',
			code:''
			
        };
	autocompleteItems;
  autocomplete;

  latitude: number = 0;
  longitude: number = 0;
  geo: any

  service = new google.maps.places.AutocompleteService();

  constructor (public viewCtrl: ViewController, private zone: NgZone, public loadingCtrl:LoadingController, public toastCtrl: ToastController,) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }
   ionViewDidEnter() {
    setTimeout(() => {
      this.searchbar.setFocus();
    },150);

 }
  presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
	  let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
    this.geo = item;
    this.geoCode(this.geo);//convert Address to lat and long
	setTimeout(()=>{
		loader.dismiss();
		if(this.location.longitude!="" && this.location.longitude!=null)
		{
			this.viewCtrl.dismiss(this.location);
		}
		else
		{
			this.presentToast("Sorry. We're not able to get the longitude & latitude of your location. Please try again.");
		}
	},1000);
  }

  updateSearch() {

    if (this.autocomplete.query == '') {
     this.autocompleteItems = [];
     return;
    }

    let me = this;
    this.service.getPlacePredictions({
    input: this.autocomplete.query,
    componentRestrictions: {
      country: 'au'
    }
   }, (predictions, status) => {
     me.autocompleteItems = [];

   me.zone.run(() => {
     if (predictions != null) {
        predictions.forEach((prediction) => {
          me.autocompleteItems.push(prediction.description);
        });
       }
     });
   });
  }

  //convert Address string to lat and long
  geoCode(address:any) {
	  let location = {
            longitude: null,
            latitude: null,
            location: '',
			street_name:'',
			state:'',
			postcode:'00000',
			code:''
			
        };
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
    let details=results[0];
	location.location=details.formatted_address;
	for(var i=0;i<details.address_components.length;i++)
	{
		var add_comp=details.address_components[i];
		if(add_comp.types[0]=="route")
		{
			location.street_name=add_comp.long_name;
		}
		else if(add_comp.types[0]=="administrative_area_level_1")
		{
			location.state=add_comp.long_name;
		}
		else if(add_comp.types[0]=="postal_code")
		{
			location.postcode=add_comp.long_name;
			location.code=add_comp.long_name;
		}
	}
	location.latitude = details.geometry.location.lat();
	location.longitude = details.geometry.location.lng();
	this.location=location;
	console.log(this.location);
   });
 }
 Exit()
 {
	 this.viewCtrl.dismiss();
 }
}