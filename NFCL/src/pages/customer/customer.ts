import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

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
  constructor(private callNumber: CallNumber, private geolocation: Geolocation, private statusBar: StatusBar, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public http: Http) { }

  private failure: boolean = true;
  private failed: boolean = false;

  ionViewDidLoad() {
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString('#636b80');
    console.log('ionViewDidLoad CustomerPage');
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();

    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error in location', error);
    });

    setTimeout(() => {
      if (this.failure) {
        console.log('Loaded unsuccessfully');
        loader.dismiss();
        this.failed = true;

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

    this.displayData(loader);
  }

  callDriver(phone: string) {
    this.callNumber.callNumber(phone, true);
  }

  private server: string = "http://localhost/~rharish/drivers.php";

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

  private latitude: number = 0;
  private longitude: number = 0;

  displayData(loader) {
    this.http.post(this.server, {
      latitude: this.latitude,
      longitude: this.longitude,
    }).map(res => res.json()).subscribe((data) => {
      let length: number = data.drivers.length;
      let drivers: Array<{dist: number, name: string, phone: number}> = data.drivers;
      drivers.sort((a, b) => {
        if (a.dist < b.dist)
          return -1;
        else if (a.dist > b.dist)
          return 1;
        else
          return 0;
      })

      if (length > 0) {
        this.driver1Dist = Number(drivers[0].dist);
        this.driver1Name = String(drivers[0].name);
        this.driver1Phone = Number(drivers[0].phone);
      }

      if (length > 1) {
        this.driver2Dist = Number(drivers[1].dist);
        this.driver2Name = String(drivers[1].name);
        this.driver2Phone = Number(drivers[1].phone);
      }

      if (length > 2) {
        this.driver3Dist = Number(drivers[2].dist);
        this.driver3Name = String(drivers[2].name);
        this.driver3Phone = Number(drivers[2].phone);
      }

      if (!this.failed) {
        if (length > 0)
          this.driver1Visible = true;
        if (length > 1)
          this.driver2Visible = true;
        if (length > 2)
          this.driver3Visible = true;

        if (length == 0)
          this.driversInfo = "<div class='failure'>No drivers found</div>";
        else if (length == 1)
          this.driversInfo = "<div class='info'>Here is the closest driver:</div>";
        else
          this.driversInfo = "<div class='info'>Here are the " + String(length) + " closest drivers:</div>";

        loader.dismiss();
        this.failure = false;
        console.log('Loaded successfully');
      }
    }, (error) => {
      this.failure = false;
      loader.dismiss();
      console.log('Server error', error);

      const alert = this.alertCtrl.create({
        title: 'Server Error',
        message: 'Please try again',
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
    });
  }
}
