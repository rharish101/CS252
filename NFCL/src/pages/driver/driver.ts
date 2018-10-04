import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the DriverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-driver',
  templateUrl: 'driver.html',
})

export class DriverPage {
  constructor(private statusBar: StatusBar, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) { }

  ionViewDidLoad() {
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString('#636b80');
    const prompt = this.alertCtrl.create({
      title: 'Details',
      message: "Enter your details",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          type: 'text'
        },
        {
          name: 'phone',
          placeholder: "Phone Number",
          type: 'tel'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel');
            this.navCtrl.popToRoot();
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data);
            this.handleData(data);
            console.log('Saved');
          }
        }
      ],
      cssClass: 'alertCustomCss',
      enableBackdropDismiss: false
    });
    prompt.present();
    console.log('ionViewDidLoad DriverPage');
  }

  updateLocation() {
    console.log("Updated Location");
  }

  handleData(data: {'name': string, 'phone': string}) {
    let phone_regex = new RegExp(String.raw`^(\+\d{2}-?)?\d+$`);
    if (!(phone_regex.test(data['phone'])) || (data['phone'] == "") || (data['name'] == "")) {
      const error = this.alertCtrl.create({
        title: 'Error',
        message: "Your details seem invalid. Please try again",
        buttons: [{
            text: 'Ok',
            handler: data => {
              console.log('Error cancel');
              this.navCtrl.popToRoot();
            }
        }],
        cssClass: 'alertCustomCss',
        enableBackdropDismiss: false
      });
      error.present();
    }
  }
}
