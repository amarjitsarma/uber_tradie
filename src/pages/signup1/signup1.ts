import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Signup1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup1',
  templateUrl: 'signup1.html',
})
export class Signup1Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup1Page');
  }
  SignUp(Type)
  {
	  this.navCtrl.push("SignupPage",{login_type:Type});
  }
  Login()
  {
	  this.navCtrl.setRoot("LoginPage");
  }

}
