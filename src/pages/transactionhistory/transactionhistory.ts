import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  FormGroup,
  FormControl

} from '@angular/forms';

/**
 * Generated class for the TransactionhistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transactionhistory',
  templateUrl: 'transactionhistory.html',
})
export class TransactionhistoryPage {
	 langs;
  langForm;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
	   this.langForm = new FormGroup({
      "langs": new FormControl({value: 'all', disabled: false})
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionhistoryPage');
  }
  doSubmit(event) {
    console.log('Submitting form', this.langForm.value);
    event.preventDefault();
  }
}
