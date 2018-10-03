import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the CustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})

export class CustomerPage {
  constructor(private statusBar: StatusBar, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private callNumber: CallNumber) { }

  ionViewDidLoad() {
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString('#636b80');
    console.log('ionViewDidLoad CustomerPage');
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    let failure: boolean = true;

    /* setTimeout(() => {
      loader.dismiss();
      failure = false;
      console.log('Loaded successfully');
    }, 1000); */

    setTimeout(() => {
      if (failure) {
        console.log('Loaded unsuccessfully');
        loader.dismiss();

        const alert = this.alertCtrl.create({
          title: 'Could not connect',
          message: 'Check your internet connection',
          buttons: [{
            text: 'OK',
            handler: data => {
              this.navCtrl.popToRoot();
            }
          }],
          cssClass: 'alertCustomCss',
          enableBackdropDismiss: false
        });
        alert.present();
      }
    }, 5000);
  }

  callDriver(phone: string) {
    this.callNumber.callNumber(phone, true);
  }
}
