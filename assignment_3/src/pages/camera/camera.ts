import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
/**
 * Generated class for the CameraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  image;
  constructor(private camera: Camera, private file: File, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }

  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options)
    .then((image) => {
      var directory = image.substring(0, image.lastIndexOf('/'));               // The directory where the picture is stored.
      var imageName = image.substring(image.lastIndexOf('/')+1, image.length);  // The name of the captured image. You might put console statements to print these strings to console.
      this.loadImageFromCacheDirectory(directory, imageName);
    })
  }

  /**
   * The image is fetched from the directory as a binary file, as loading local resources is not permitted.
   * This is done using the underlying file system. More on it: https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/
   */

   loadImageFromCacheDirectory(directory, fileName){
    /**
     * readAsDataURL encodes the media files. Link: https://ionicframework.com/docs/native/file/#readAsDataURL
     * Since the imagepath is not stored anywhere, it disappears if you reopen this page.
     */
    this.file.readAsDataURL(directory, fileName)
    .then((image) => {
      this.image = image;
    });
   }
}
