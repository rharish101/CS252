import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';

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
  constructor(private geolocation: Geolocation, private statusBar: StatusBar, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private callNumber: CallNumber) { }

  ionViewDidLoad() {
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString('#636b80');
    console.log('ionViewDidLoad CustomerPage');
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude, resp.coords.longitude);
    });
    loader.present();
    let failure: boolean = true;

    setTimeout(() => {
      loader.dismiss();
      failure = false;
      console.log('Loaded successfully');
      this.displayData();
    }, 1000);

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

  public driversInfo: string = "";

  public driver1Visible: boolean = false;
  public driver1Dist: number = 0;
  public driver1Name: string = "";
  public driver1Phone: number = 0;

  public driver2Visible: boolean = false;
  public driver2Dist: number = 0;
  public driver2Name: string = "";
  public driver2Phone: number = 0;

  public driver3Visible: boolean = false;
  public driver3Dist: number = 0;
  public driver3Name: string = "";
  public driver3Phone: number = 0;

  displayData() {
    this.driversInfo = "<div class='info'>Here are the 3 closest drivers:</div>";

    this.driver1Visible = true;
    this.driver1Dist = 5;
    this.driver1Name = "Ramu";
    this.driver1Phone = 1234567890;

    this.driver2Visible = true;
    this.driver2Dist = 7;
    this.driver2Name = "Motu";
    this.driver2Phone = 2234567890;

    this.driver3Visible = true;
    this.driver3Dist = 8;
    this.driver3Name = "Chotu";
    this.driver3Phone = 3234567890;
  }
}
