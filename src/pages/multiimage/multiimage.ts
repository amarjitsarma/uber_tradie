import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
/**
 * Generated class for the MultiimagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-multiimage',
  templateUrl: 'multiimage.html',
})
export class MultiimagePage {
	Photos:{Display:string[],Base64:string[]}={Display:[],Base64:[]};
	constructor(public navCtrl: NavController, public navParams: NavParams, public photoLibrary: PhotoLibrary, public viewCtrl: ViewController, public imagePicker: ImagePicker, public base64: Base64, public camera: Camera, public alertCtrl: AlertController) {
		this.UploadImages();
	}
	UploadImages()
	{
		const confirm = this.alertCtrl.create({
			title: 'Upload Photo!',
			message: 'How do your want to proceed?',
			buttons: [{
				text: 'Select from Gallery',
				handler: () => {
					this.Photos={Display:[],Base64:[]};
					let options={maximumImagesCount: 5, width: 1024, height: 768, outputType: 1 };
					this.imagePicker.getPictures(options).then((results) => {
						for (var i = 0; i < results.length; i++) {
							this.Photos.Display.push(results[i]);
							alert(results[i]);
							this.base64.encodeFile(results[i]).then((base64File: string) => {
								base64File=base64File.replace("data:image/*;charset=utf-8;base64,", "data:image/jpeg;base64,");
								this.Photos.Base64.push(base64File);
							}, 
							(err) => {
								console.log(err);
							});
						}
						this.viewCtrl.dismiss(this.Photos);
					}, (err) => {
						this.viewCtrl.dismiss(this.Photos);
					});
				}
			},
			{
				text: 'Capture by Camera',
				handler: () => {
					this.Photos={Display:[],Base64:[]};
					this.camera.getPicture({
						sourceType: this.camera.PictureSourceType.CAMERA,
						destinationType: this.camera.DestinationType.DATA_URL,
						targetWidth: 1024,
						targetHeight: 768
					}).then((data) => {
						this.Photos.Display.push('data:image/jpg;base64,' + data);
						this.Photos.Base64.push('data:image/jpg;base64,' + data);
						this.viewCtrl.dismiss(this.Photos);
					}, 
					(err) => {
						this.viewCtrl.dismiss(this.Photos);
					})

				}
			}]
		});
		confirm.present();
	}
	Done()
	{
		this.viewCtrl.dismiss(this.Photos);
	}
	Close()
	{
		this.viewCtrl.dismiss({Display:[],Base64:[]});
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad MultiimagePage');
	}
	ShowImage:string="";
	Show(photo)
	{
		this.ShowImage=photo;
	}

}
