import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import {NgxImageCompressService} from 'ngx-image-compress';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';


@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;
  account: { title: string } = {
    title: ''
  };
  isReadyToSave: boolean;
  photo:string="";
  item: any;
  basic_id:any="";

  form: FormGroup;
  source:string="https://ptezone.com.au";//"http://localhost:8000";

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public imageCompress: NgxImageCompressService, private transfer: FileTransfer, private fileChooser: FileChooser, private filePath: FilePath, private file: File) {
	 
	  if(this.navParams.get("basic_id"))
	  {
		  this.basic_id=this.navParams.get("basic_id");
	  }
    this.form = formBuilder.group({
      profilePic: ['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
	this.avatar=this.navParams.get("avatar");
  }

  ionViewDidLoad() {

  }

  getPicture() {
	  const confirm = this.alertCtrl.create({
      title: 'Upload Photo!',
      message: 'How do your want to proceed?',
      buttons: [
        {
          text: 'Select from Gallery',
          handler: () => {
            if (Camera['installed']()) {
				this.camera.getPicture({
					sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
					destinationType: this.camera.DestinationType.DATA_URL,
					targetWidth: 600,
					targetHeight: 600
				}).then((data) => {
					this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
					this.photo='data:image/jpg;base64,' + data;
				}, (err) => {
					alert('Unable to take photo');
				})
			} else {
				
				this.fileInput.nativeElement.click();
			}
          }
        },
        {
          text: 'Capture by Camera',
          handler: () => {
            if (Camera['installed']()) {
				this.camera.getPicture({
					sourceType: this.camera.PictureSourceType.CAMERA,
					destinationType: this.camera.DestinationType.DATA_URL,
					targetWidth: 600,
					targetHeight: 600
				}).then((data) => {
					this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
					this.photo='data:image/jpg;base64,' + data;
				}, (err) => {
					alert('Unable to take photo');
				})
			} else {
				
				this.fileInput.nativeElement.click();
			}
          }
        }
      ]
    });
    confirm.present();
  }
	UploadImage()
	{
		let scope=this;
		scope.fileChooser.open().then(uri => {
			scope.filePath.resolveNativePath(uri).then(filePath => {
				console.log(filePath);
				let arr=filePath.toUpperCase().split(".");
				if(arr[arr.length-1]!='JPG' && arr[arr.length-1]!='JPEG' && arr[arr.length-1]!='PDF')
				{
					alert("Please upload either JPG/JPEG image or PDF file");
				}
				else
				{
					scope.file.resolveLocalFilesystemUrl(uri).then(fileEntry => {
						fileEntry.getMetadata((metadata) => {
							if(metadata.size<=2097152)
							{
								console.log(JSON.stringify(fileEntry));
							}
						});
					});
				}
			}).catch(err => alert(err));
			
		}).catch(e => alert(JSON.stringify(e)));	
	}
  processWebImage(event) {
	let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container" style="height:100%; width:100%;">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
	  //loader.present();
	var arr=event.target.files[0].name.split(".");
	if(arr[arr.length-1].toUpperCase()=="JPG" || arr[arr.length-1].toUpperCase()=="PNG" || arr[arr.length-1].toUpperCase()=="JPEG")
	{
		let reader = new FileReader();
		reader.onload = (readerEvent) => {
			let imageData = (readerEvent.target as any).result;
			this.form.patchValue({ 'profilePic': imageData });
			if(this.imageCompress.byteCount(imageData)>1050000){
				let ratio=2050000*100/this.imageCompress.byteCount(imageData);
				this.imageCompress.compressFile(imageData, orientation, ratio, ratio).then(
				result => {
					this.photo = result;
					//loader.dismiss();
				});
			}
			else
			{
				this.photo=imageData;
				//loader.dismiss();
			}
		};
    reader.readAsDataURL(event.target.files[0]);
	}
    else
	{
		//loader.dismiss();
		alert("Please select either JPG or PNG file.");
	}
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
	 // this.backgroundMode.disable();
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
   avatar:any=0;
  done() 
  {
	 // this.backgroundMode.disable();
	  if(this.navParams.get("basic_id"))
	  {
		if(this.photo!="" && this.account.title!="")
		{
			this.httpClient.post<any>(this.source+'/api/SavePhoto',{
				basic_id:this.navParams.get("basic_id"),
				Photos:[this.photo],
				title:this.account.title
			}).subscribe(data => {
				
				this.viewCtrl.dismiss(this.photo);
			},
			err => {
				alert("Unable to upload");		
			});
			
		}
	  }
	  else
	  {
		  this.viewCtrl.dismiss({upload: this.photo, file_description:this.account.title});
	  }
  }
}
