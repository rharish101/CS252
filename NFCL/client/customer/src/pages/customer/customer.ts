import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Http, RequestOptions, Headers} from '@angular/http';
import { GlobalVarsService } from '../../services/globalvars/globalvars';
import 'rxjs/add/operator/map';
import 'leaflet';
import L from 'leaflet';

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

  private server: string = "https://nfcl.pythonanywhere.com/api/nearbyDrivers";

  public driversInfo: string = "";
  public mapVisible: string = "hidden";

  public driver1Visible: boolean = false;
  public driver1Dist: number;
  public driver1Name: string;
  public driver1Phone: string;
  public driver1Latitude: number;
  public driver1Longitude: number;

  public driver2Visible: boolean = false;
  public driver2Dist: number;
  public driver2Name: string;
  public driver2Phone: string;
  public driver2Latitude: number;
  public driver2Longitude: number;

  public driver3Visible: boolean = false;
  public driver3Dist: number;
  public driver3Name: string;
  public driver3Phone: string;
  public driver3Latitude: number;
  public driver3Longitude: number;

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
        console.log("Geolocation:", resp.coords.latitude, resp.coords.longitude);

        var map = L.map("map").setView([resp.coords.latitude, resp.coords.longitude], 13);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attributions: 'www.tphangout.com',
          maxZoom: 18
        }).addTo(map);

        var redMarker = new L.Icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        var blueMarker = new L.Icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        var selfMarker = L.marker([resp.coords.latitude, resp.coords.longitude], {icon: redMarker});
        selfMarker.bindPopup("You");
        selfMarker.addTo(map);

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

          function shift_val(val1: number, val2: number) {
            let sign: number = Math.sign(val1 - val2);
            if (sign == 0)
              sign = 1;
            return val1 + 0.1 * sign;
          }

          if (length > 0) {
            this.driver1Dist = Math.round(Number(drivers[0].distance) / 10) / 100.0
            this.driver1Name = String(drivers[0].name);
            this.driver1Phone = String(drivers[0].mobile_no);
            this.driver1Latitude = Number(drivers[0].latitude);
            this.driver1Longitude = Number(drivers[0].longitude);

            if (this.driver1Dist < 0.1) {
              this.driver1Latitude = shift_val(this.driver1Latitude, resp.coords.latitude);
              this.driver1Longitude = shift_val(this.driver1Longitude, resp.coords.longitude);
            }

            var driver1Marker = L.marker([this.driver1Latitude, this.driver1Longitude], {icon: blueMarker});
            driver1Marker.bindPopup(this.driver1Name);
            driver1Marker.addTo(map);
          }

          if (length > 1) {
            this.driver2Dist = Math.round(Number(drivers[1].distance) / 10) / 100.0
            this.driver2Name = String(drivers[1].name);
            this.driver2Phone = String(drivers[1].mobile_no);
            this.driver2Latitude = Number(drivers[1].latitude);
            this.driver2Longitude = Number(drivers[1].longitude);

            if (this.driver2Dist < 0.1) {
              this.driver2Latitude = shift_val(this.driver2Latitude, resp.coords.latitude);
              this.driver2Longitude = shift_val(this.driver2Longitude, resp.coords.longitude);
            }

            var driver2Marker = L.marker([this.driver2Latitude, this.driver2Longitude], {icon: blueMarker});
            driver2Marker.bindPopup(this.driver2Name);
            driver2Marker.addTo(map);
          }

          if (length > 2) {
            this.driver3Dist = Math.round(Number(drivers[2].distance) / 10) / 100.0
            this.driver3Name = String(drivers[2].name);
            this.driver3Phone = String(drivers[2].mobile_no);
            this.driver3Latitude = Number(drivers[2].latitude);
            this.driver3Longitude = Number(drivers[2].longitude);

            if (this.driver3Dist < 0.1) {
              this.driver3Latitude = shift_val(this.driver3Latitude, resp.coords.latitude);
              this.driver3Longitude = shift_val(this.driver3Longitude, resp.coords.longitude);
            }

            var driver3Marker = L.marker([this.driver3Latitude, this.driver3Longitude], {icon: blueMarker});
            driver3Marker.bindPopup(this.driver3Name);
            driver3Marker.addTo(map);
          }

          if (!this.failed) {
            if (length > 0) {
              this.driver1Visible = true;
              this.mapVisible = "visible";
              map.invalidateSize();
            }
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
