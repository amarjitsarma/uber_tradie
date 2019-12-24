import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, MenuController, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { DocumentPicker } from '@ionic-native/document-picker';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { CommondataProvider } from '../../providers/commondata/commondata';
import { MyApp } from '../../app/app.component';

import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { PhotoViewer } from '@ionic-native/photo-viewer';


declare var StripeCheckout;
@IonicPage()
@Component({
  selector: 'page-flfiles',
  templateUrl: 'flfiles.html',
})
export class FlfilesPage {
	document_name:string="";
	Error:string="";
	source:string="https://ptezone.com.au";//"http://localhost:8000";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient:HttpClient, public device:Device, public toastCtrl: ToastController, public platform: Platform, public commonProvider: CommondataProvider, public menuController:MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private transfer: FileTransfer, private fileChooser: FileChooser, private filePath: FilePath, private file: File, public alertCtrl: AlertController, public docPicker: DocumentPicker, public documentViewer: DocumentViewer, public photoViewer: PhotoViewer){
	  this.LoadDocuments();
	  
  }
  presentToast(Message) {
    const toast = this.toastCtrl.create({
      message: Message,
      duration: 3000
    });
  }
	UploadPLI()
	{
		this.UploadFile('Public Liability Insurance');
	}
	UploadWCI()
	{
		this.UploadFile('Work Cover Insurance');
	}
	UploadOther()
	{
		this.Error="";
		if(this.document_name!="" && this.document_name!=null)
		{
			this.UploadFile(this.document_name);
		}
		else
		{
			this.Error="*Please mention the document name.";
		}
	}
	UploadFile(DocumentName)
	{
		this.Error="";
		let scope=this;
		if(scope.platform.is('ios')) {
			this.docPicker.getFile('all')
			.then(uri => {
				scope.file.resolveLocalFilesystemUrl(uri).then(fileEntry => {
					fileEntry.getMetadata((metadata) => {
						if(metadata.size<=2097152)
						{
							let name_arr=uri.split("/");
							let loader:any = scope.loadingCtrl.create({
								spinner: "hide",
								content: `<div class="custom-spinner-container">
											<div class="custom-spinner-box">
												<img src="assets/img/spinner.gif" width="100%"/>
											</div>
										</div>`
							});
							loader.present();
							const fileTransfer: FileTransferObject = scope.transfer.create();
							
							let options1: FileUploadOptions = {
								fileKey: 'upload_file',
								fileName: name_arr[name_arr.length-1],
								headers: {},
								params: {"user_id":this.commonProvider.User.id,'document_name':DocumentName},
								mimeType: "multipart/form-data",
								chunkedMode : false
							}
							fileTransfer.upload(uri, 'https://www.ptezone.com.au/api/UploadDocument', options1).then((data) => {
								// success
								scope.LoadDocuments();
								setTimeout(()=>{
									loader.dismiss();
									scope.presentToast(data.response);
								},1000);
							}, (err) => {
								// error
								scope.Error=JSON.stringify(err);
								loader.dismiss();
							});
						}
						else
						{
							scope.Error="*Please upload files less than 2 MB.";
						}
					});
				});
			})
			.catch(e => alert(JSON.stringify(e)));
		}
		else
		{
			scope.fileChooser.open().then(uri => {
				scope.filePath.resolveNativePath(uri).then(filePath => {
					
					let arr=filePath.toUpperCase().split(".");
					if(arr[arr.length-1]!='JPG' && arr[arr.length-1]!='JPEG' && arr[arr.length-1]!='PDF')
					{
						scope.Error="*Please upload either JPG/JPEG image or PDF file";
					}
					
					else
					{
						scope.Error="";
						let name_arr=filePath.toUpperCase().split("/");
						scope.file.resolveLocalFilesystemUrl(uri).then(fileEntry => {
							fileEntry.getMetadata((metadata) => {
								if(metadata.size<=2097152)
								{
									scope.Error="";
									let loader:any = scope.loadingCtrl.create({
										spinner: "hide",
										content: `<div class="custom-spinner-container">
													<div class="custom-spinner-box">
														<img src="assets/img/spinner.gif" width="100%"/>
													</div>
												</div>`
									});
									loader.present();
									const fileTransfer: FileTransferObject = scope.transfer.create();
									// regarding detailed description of this you cn just refere ionic 2 transfer plugin in official website
									let options1: FileUploadOptions = {
										fileKey: 'upload_file',
										fileName: name_arr[name_arr.length-1],
										headers: {},
										params: {"user_id":this.commonProvider.User.id,'document_name':DocumentName},
										mimeType: "multipart/form-data",
										chunkedMode : false
									}
									fileTransfer.upload(uri, 'https://www.ptezone.com.au/api/UploadDocument', options1).then((data) => {
										// success
										scope.LoadDocuments();
										setTimeout(()=>{
											loader.dismiss();
											scope.presentToast(data.response);
										},1000);
									}, (err) => {
										// error
										scope.Error=JSON.stringify(err);
										loader.dismiss();
									});
								}
								else
								{
									scope.Error="*Please upload files less than 2 MB.";
								}
							});
						});
					}
				}).catch(err => alert(err));
				
			}).catch(e => alert(JSON.stringify(e)));
		}
	}
	//Error:string="";
  ionViewDidLoad() {
	  let scope=this;
	  setTimeout(() => {
			this.handler =  StripeCheckout.configure({
				key: 'pk_test_Hz0utMw4W2scWTYi1Q6M4Czs00DXcuAZ2W',
				image: 'https://stripe.com/img/documentation/checkout/marketplace.png', // Picture you want to show in pop up
				locale: 'auto',
				token: token => {
					this.commonProvider.tradie_basic.status=3;
					let loader:any = scope.loadingCtrl.create({
						spinner: "hide",
						content: `<div class="custom-spinner-container">
									<div class="custom-spinner-box">
										<img src="assets/img/spinner.gif" width="100%"/>
									</div>
								</div>`
					});
					loader.present();
					scope.httpClient.post<any>(this.source+'/api/VerifyTradie',{id:this.commonProvider.tradie_basic.id,remarks:token.id})
					.subscribe(data => {
						loader.dismiss();
						alert(data.message);
						if(data.status==1)
						{
							this.commonProvider.tradie_basic.status=3;
							scope.LoadDocuments();
						}
						else
						{
							this.commonProvider.tradie_basic.status=2;
						}
					},
					err => {
						loader.dismiss();
						this.commonProvider.tradie_basic.status=2;
						scope.Error=JSON.stringify(err);
					})
				}
			})
		}, 1000);
  }
	DownloadFile(file_name)
	{
		let loader:any = this.loadingCtrl.create({
			spinner: "hide",
			content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		let exts=file_name.split(".");
		if(exts[exts.length-1]=="pdf" || exts[exts.length-1]=="PDF")
		{
			loader.present();
			const fileTransfer: FileTransferObject = this.transfer.create();
			const url = encodeURI('https://ptezone.com.au/uploads/'+file_name);
			fileTransfer.download(url, this.file.externalDataDirectory + file_name).then((entry) => {
				loader.dismiss();
				alert('Download complete: ' + file_name);
				const options: DocumentViewerOptions = {
					title: file_name
				}
				this.documentViewer.viewDocument(entry.toURL(), 'application/pdf', options);
			}, (error) => {
				alert(JSON.stringify(error));
				loader.dismiss();
			});
		}
		else
		{
			this.photoViewer.show(encodeURI('https://ptezone.com.au/uploads/'+file_name));
		}
		//window.open(encodeURI('https://ptezone.com.au/uploads/'+file_name));
	}
	documents:{pli:any,wci:any,others:any[]}={pli:'',wci:'',others:[]};
	LoadDocuments()
	{
		let loader:any = this.loadingCtrl.create({
		spinner: "hide",
		content: `<div class="custom-spinner-container">
						<div class="custom-spinner-box">
							<img src="assets/img/spinner.gif" width="100%"/>
						</div>
					</div>`
		});
		loader.present();
		this.httpClient.post<any>(this.source+'/api/GetDocuments',{user_id:this.commonProvider.User.id})
		.subscribe(data => {
			loader.dismiss();
			this.documents=data;
			this.commonProvider.LoadBasic();
		},
		err => {
			this.Error=JSON.stringify(err);
			loader.dismiss();
		});
	}
	DeleteFile(id)
	{
		this.httpClient.post<any>(this.source+'/api/DeleteDocuments',{id:id})
		.subscribe(data => {
			alert(data.message);
			this.LoadDocuments();
		},
		err => {
			this.Error=JSON.stringify(err);
		})
	}
	handler:any;
	handlerOpen(){
		this.handler.open({
			name: "Payment for Registration", // Pass your application name
			amount: 2000, //this.Bids[0].bid_amount*100,
			currency: 'aud',			// Pass your billing amount
		});
	}
	PayFees()
	{
		this.handlerOpen();
	}
}
