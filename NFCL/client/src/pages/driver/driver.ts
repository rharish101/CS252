import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Http, RequestOptions, Headers } from '@angular/http';
import { GlobalVarsService } from '../../services/globalvars/globalvars';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

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
  constructor(private network: Network, private storage: Storage, private geolocation: Geolocation, private statusBar: StatusBar, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http, public globalvars:GlobalVarsService) { }

  private server: string = "https://cse.iitk.ac.in/users/rharish/NFCL/update.php";

  private headers = new Headers();
  private popup;
  private onDestroy$ = new Subject<void>();

  ionViewDidEnter() {
    this.storage.get('driverdetails').then((val) => {
      if (val === null) {
        this.storage.set('driverdetails', 'exists');
        this.showPopup({
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
      }
      else {
        this.notifVisible = true;
        this.updateLocation();
      }
    });
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

  sendDetails(post_json, sub_func, use_geo: boolean) {
    let failure: boolean = true;
    let failed: boolean = false;

    let sendFunc = function (latitude, longitude) {
      this.storage.get('drivercontacts').then((val) => {
        post_json.name = val.name;
        post_json.phone = val.phone;
        post_json.latitude = latitude;
        post_json.longitude = longitude;

        this.headers.append('Access-Control-Allow-Origin' , '*');
        this.headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        this.headers.append('Accept','application/json');
        this.headers.append('content-type','application/json');

        this.http.post(this.server, post_json, new RequestOptions({ headers:this.headers})).map(res => res.json()).subscribe((data) => {
          if (!failed) {
            failure = false;
            sub_func(data);
          }
        }, (error) => {
          if (!failed) {
            failure = false;
            console.log('Server error', error);
            this.showPopup({
              title: 'Server Error',
              message: 'Please try again',
              buttons: ['OK'],
              cssClass: 'alertCustomCss',
            });
          }
        });
      });
    }

    setTimeout(() => {
      if (failure) {
        console.log('Loaded unsuccessfully');
        failed = true;

        this.showPopup({
          title: 'Could not connect',
          message: 'Check your internet connection',
          buttons: ['OK'],
          cssClass: 'alertCustomCss'
        });
      }
    }, 5000);

    if ((this.network.type === "none") && (!failed)) {
      console.log('Connection error');
      failure = false;
      this.showPopup({
        title: 'Could not connect',
        message: 'Check your internet connection',
        buttons: ['OK'],
        cssClass: 'alertCustomCss',
        enableBackdropDismiss: false
      });
    }
    else if (!failed) {
      if (use_geo) {
        this.geolocation.getCurrentPosition().then((resp) => {
          console.log(resp.coords.latitude, resp.coords.longitude);
          sendFunc(resp.coords.latitude, resp.coords.longitude);
        }).catch((error) => {
          if (!failed) {
            failure = false;
            console.log('Error in location', error);
            this.showPopup({
              title: 'Error',
              message: "Could not retrieve location. Please try again",
              buttons: ['Ok'],
              cssClass: 'alertCustomCss',
            });
          }
        });
      }
      else
        sendFunc(0, 0);
    }
  }

  deleteDetails() {
    let cleanDetails = function (data) {
      this.storage.set('driverdetails', null);
      this.storage.set('drivercontacts', null);
      this.onDestroy$.next();
      console.log('Data delete successful', data);
      this.showPopup({
        title: 'Success',
        message: 'Data successfully deleted',
        buttons: [{
          text: 'Exit',
          handler: data => {
            this.navCtrl.popToRoot();
          }
        }],
        cssClass: 'alertCustomCss',
        enableBackdropDismiss: false
      });
    }

    let json = {
      name: "",
      phone: 0,
      latitude: 0,
      longitude: 0,
      registration: this.globalvars.registrationId,
      remove: true
    }

    this.sendDetails(json, cleanDetails, false);
  }

  showPopup(popup) {
    try {
      this.popup.dismiss();
    } catch(e) {
      console.log("try-catch", e);
    }
    this.popup = this.alertCtrl.create(popup);
    this.popup.present();
  }

  updateLocation() {
    let logger = function (data) {
      console.log('Location update successful', data);
    }

    let json = {
      name: "",
      phone: 0,
      latitude: 0,
      longitude: 0,
      registration: this.globalvars.registrationId,
      remove: false
    }

    this.sendDetails(json, logger, true);
  }

  private notifVisible: boolean = false;

  handleData(data: {'name': string, 'phone': string}) {
    let phone_regex = new RegExp(String.raw`^(\+\d{2}-?)?\d+$`);
    if (!(phone_regex.test(data['phone'])) || (data['phone'] == "") || (data['name'] == "")) {
      this.showPopup({
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
    }
    else {
      this.storage.set('drivercontacts', {"name": data['name'], "phone": Number(data['phone'])});
      this.updateLocation();
      Observable.interval(1000 * 60 * 20).takeUntil(this.onDestroy$).subscribe(x => {
        this.updateLocation();
      });
      this.notifVisible = true;
    }
  }
}
