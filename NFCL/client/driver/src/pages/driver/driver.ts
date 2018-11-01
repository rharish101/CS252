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
import { Push, PushObject, PushOptions } from '@ionic-native/push';
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
  constructor(private network: Network, private storage: Storage, private geolocation: Geolocation, private statusBar: StatusBar, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http, public globalvars: GlobalVarsService, public push: Push) { }

  private server: string = "http://nfcl.pythonanywhere.com/api/"
  private delete_api: string = "deleteDriver";
  private update_api: string = "updateDriver";

  private headers = new Headers();
  private popup;
  private onDestroy$ = new Subject<void>();

  ionViewDidEnter() {
    this.statusBar.overlaysWebView(false);
    this.storage.get('driverdetails').then((val) => {
      if (val === null) {
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
      else
        this.initPage();
    });
    console.log('ionViewDidEnter DriverPage');
  }

  ionViewWillEnter() {
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString('#636b80');
    this.statusBar.overlaysWebView(false);
  }

  ionViewWillLeave() {
    this.statusBar.overlaysWebView(true);
    this.statusBar.styleBlackTranslucent();
    this.onDestroy$.next();

    let logger = (data) => {
      console.log('Server data clear successful', data);
    }

    let json = {
      name: "",
      mobile_no: "",
      latitude: 0,
      longitude: 0,
      mob_id: this.globalvars.registrationId,
    }

    this.sendDetails(json, logger, this.delete_api, false);
  }

  initPage() {
    this.updateLocation();
    Observable.interval(1000 * 60 * 20).takeUntil(this.onDestroy$).subscribe(x => {
      this.updateLocation();
    });

    const options: PushOptions = {android: {senderID: this.globalvars.registrationId}};
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification) => {
      console.log('Received notification', notification);
    });
  }

  sendDetails(post_json, sub_func, api, use_geo: boolean) {
    let failure: boolean = true;
    let failed: boolean = false;

    let sendFunc = (latitude, longitude) => {
      this.storage.get('drivercontacts').then((val) => {
        post_json.name = val.name;
        post_json.mobile_no = val.phone;
        post_json.latitude = latitude;
        post_json.longitude = longitude;

        this.headers.append('Access-Control-Allow-Origin' , '*');
        this.headers.append('Access-Control-Allow-Headers' , '*');
        this.headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        this.headers.append('Accept','application/json');
        this.headers.append('content-type','application/json');

        this.http.post(this.server + api, post_json, new RequestOptions({ headers:this.headers})).map(res => res.json()).subscribe((data) => {
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
    }, 10000);

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
    let cleanDetails = (data) => {
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
      mobile_no: "",
      latitude: 0,
      longitude: 0,
      mob_id: this.globalvars.registrationId,
      remove: true
    }

    this.sendDetails(json, cleanDetails, this.delete_api, false);
  }

  updateLocation() {
    let logger = (data) => {
      console.log('Location update successful', data);
    }

    let json = {
      name: "",
      mobile_no: "",
      latitude: 0,
      longitude: 0,
      mob_id: this.globalvars.registrationId,
      remove: false
    }

    this.sendDetails(json, logger, this.update_api, true);
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
      this.storage.set('driverdetails', 'exists');
      this.storage.set('drivercontacts', {"name": data['name'], "phone": data['phone']});
      this.initPage();
    }
  }

  exitPage() {
    this.navCtrl.popToRoot();
  }
}
