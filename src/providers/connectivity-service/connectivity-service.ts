import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Network } from '@ionic-native/network';
@Injectable()
export class ConnectivityServiceProvider {
	onDevice: boolean;
  constructor(public http: HttpClient, public platform: Platform, public network: Network) {
    console.log('Hello ConnectivityServiceProvider Provider');
	this.onDevice = this.platform.is('cordova');
  }
  isOnline(): boolean {
    if(this.onDevice && this.network.type){
      return this.network.type != 'none';
    } else {
      return navigator.onLine; 
    }
  }

  isOffline(): boolean {
    if(this.onDevice && this.network.type){
      return this.network.type == 'none';
    } else {
      return !navigator.onLine;   
    }
  }

  watchOnline(): any {
    return this.network.onConnect();
  }

  watchOffline(): any {
    return this.network.onDisconnect();
  }

}