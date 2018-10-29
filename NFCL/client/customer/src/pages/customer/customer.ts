import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Http, RequestOptions, Headers} from '@angular/http';
import { GlobalVarsService } from '../../services/globalvars/globalvars';
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
  constructor(private network: Network, private callNumber: CallNumber, private geolocation: Geolocation, private statusBar: StatusBar, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public http: Http, public globalvars: GlobalVarsService) { }

  private failure: boolean = true;
  private failed: boolean = false;

  ionViewDidEnter() {
    this.statusBar.overlaysWebView(false);
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();

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
    }, 10000);

    this.displayData(loader);
    console.log('ionViewDidEnter DriverPage');
  }

  ionViewWillEnter() {
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString('#636b80');
  }

  ionViewWillLeave() {
    this.statusBar.overlaysWebView(true);
    this.statusBar.styleBlackTranslucent();
  }

  callDriver(phone: string) {
    this.callNumber.callNumber(phone, true);
  }

  private server: string = "http://nfcl.pythonanywhere.com/api/nearbyDrivers";

  public driversInfo: string = "";

  public driver1Visible: boolean = false;
  public driver1Dist: number;
  public driver1Name: string;
  public driver1Phone: string;
  public driver1Latitude: string;
  public driver1Longitude: string;

  public driver2Visible: boolean = false;
  public driver2Dist: number;
  public driver2Name: string;
  public driver2Phone: string;
  public driver2Latitude: string;
  public driver2Longitude: string;

  public driver3Visible: boolean = false;
  public driver3Dist: number;
  public driver3Name: string;
  public driver3Phone: string;
  public driver3Latitude: string;
  public driver3Longitude: string;

  private headers = new Headers();

  displayData(loader) {
    if (this.network.type === "none") {
      this.failure = false;
      loader.dismiss();
      console.log('Connection error');

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
    else {
      this.geolocation.getCurrentPosition().then((resp) => {
        console.log(resp.coords.latitude, resp.coords.longitude);

        this.headers.append('Access-Control-Allow-Origin' , '*');
        this.headers.append('Access-Control-Allow-Headers' , '*');
        this.headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        this.headers.append('Accept','application/json');
        this.headers.append('content-type','application/json');

        this.http.post(this.server, {
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude,
        }, new RequestOptions({ headers:this.headers})).map(res => res.json()).subscribe((data) => {
          let length: number = data.drivers.length;
          let drivers: Array<{distance: string, name: string, mobile_no: string, latitude: string, longitude: string, x_cordinate: string, y_cordinate: string}> = data.drivers;
          drivers.sort((a, b) => {
            if (Number(a.distance) < Number(b.distance))
              return -1;
            else if (Number(a.distance) > Number(b.distance))
              return 1;
            else
              return 0;
          })

          if (length > 0) {
            this.driver1Dist = Number(drivers[0].distance);
            this.driver1Name = String(drivers[0].name);
            this.driver1Phone = String(drivers[0].mobile_no);
            this.driver1Latitude = String(drivers[0].latitude);
            this.driver1Longitude = String(drivers[0].longitude);
          }

          if (length > 1) {
            this.driver2Dist = Number(drivers[1].distance);
            this.driver2Name = String(drivers[1].name);
            this.driver2Phone = String(drivers[1].mobile_no);
            this.driver2Latitude = String(drivers[1].latitude);
            this.driver2Longitude = String(drivers[1].longitude);
          }

          if (length > 2) {
            this.driver3Dist = Number(drivers[2].distance);
            this.driver3Name = String(drivers[2].name);
            this.driver3Phone = String(drivers[2].mobile_no);
            this.driver3Latitude = String(drivers[2].latitude);
            this.driver3Longitude = String(drivers[2].longitude);
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
          if (!this.failed) {
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
          }
        });
      }).catch((error) => {
        if (!this.failed) {
          this.failure = false;
          loader.dismiss();
          console.log('Error in location', error);

          const alert = this.alertCtrl.create({
            title: 'Error',
            message: "Could not retrieve location. Please try again",
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
      });
    }
  }
}
