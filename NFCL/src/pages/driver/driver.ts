import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
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

  ionViewDidLoad() {
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString('#636b80');
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
                this.statusBar.overlaysWebView(true);
                this.statusBar.styleBlackTranslucent();
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
    console.log('ionViewDidLoad DriverPage');
  }

  deleteDetails() {
    this.storage.get('drivercontacts').then((val) => {
      this.http.post(this.server, {
        name: val.name,
        phone: val.phone,
        registration: this.globalvars.registrationId,
        latitude: 0,
        longitude: 0,
        remove: true
      }).map(res => res.json()).subscribe((data) => {
        this.storage.set('driverdetails', null);
        this.storage.set('drivercontacts', null);
        console.log('Data delete successful', data);
        this.showPopup({
          title: 'Success',
          message: 'Data successfully deleted',
          buttons: [
            {
              text: 'Exit',
              handler: data => {
                this.statusBar.overlaysWebView(true);
                this.statusBar.styleBlackTranslucent();
                this.navCtrl.popToRoot();
              }
            }
          ],
          cssClass: 'alertCustomCss',
          enableBackdropDismiss: false
        });
      }, (error) => {
        console.log('Server error', error);
        this.showPopup({
          title: 'Server Error',
          message: 'Please try again',
          buttons: ['OK'],
          cssClass: 'alertCustomCss',
        });
      });
      this.onDestroy$.next();
    });
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

  private server: string = "https://cse.iitk.ac.in/users/rharish/NFCL/update.php";

  private notifVisible: boolean = false;
  private popup;
  private onDestroy$ = new Subject<void>();

  updateLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // this.latitude = resp.coords.latitude;
      // this.longitude = resp.coords.longitude;
      console.log(resp.coords.latitude, resp.coords.longitude);

      if (this.network.type === "none") {
        console.log('Connection error');
        this.showPopup({
          title: 'Could not connect',
          message: 'Check your internet connection',
          buttons: [{
            text: 'OK',
            handler: data => {
              this.statusBar.overlaysWebView(true);
              this.statusBar.styleBlackTranslucent();
              this.navCtrl.popToRoot();
            }
          }],
          cssClass: 'alertCustomCss',
          enableBackdropDismiss: false
        });
      }
      else {
        this.storage.get('drivercontacts').then((val) => {
          this.http.post(this.server, {
            name: val.name,
            phone: val.phone,
            registration: this.globalvars.registrationId,
            latitude: resp.coords.latitude,
            longitude: resp.coords.longitude,
            remove: false
          }).map(res => res.json()).subscribe((data) => {
            console.log('Location update successful', data);
          }, (error) => {
            console.log('Server error', error);
            this.showPopup({
              title: 'Server Error',
              message: 'Please try again',
              buttons: ['OK'],
              cssClass: 'alertCustomCss',
            });
          });
        });
      }
    }).catch((error) => {
      console.log('Error in location', error);
      this.showPopup({
        title: 'Error',
        message: "Could not retrieve location. Please try again",
        buttons: ['Ok'],
        cssClass: 'alertCustomCss',
      });
    });
  }

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
            this.statusBar.overlaysWebView(true);
            this.statusBar.styleBlackTranslucent();
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
