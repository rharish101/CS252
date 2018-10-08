import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import { GlobalVarsService } from '../../services/globalvars/globalvars';
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
  constructor(private geolocation: Geolocation, private statusBar: StatusBar, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http, public globalvars:GlobalVarsService) { }

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

  ionViewDidLeave() {
    this.http.post(this.server, {
      name: this.name,
      phone: this.phone,
      latitude: 0,
      longitude: 0,
      remove: true
    }).map(res => res.json()).subscribe((data) => {
      console.log('Data delete successful', data);
    }, (error) => {
      console.log('Server error', error);
    });
    this.onDestroy$.next();
  }

  private server: string = "http://localhost/NFCL/update.php";
  private name: string = "";
  private phone: number = 0;
  // private latitude: number = 0;
  // private longitude: number = 0;

  private popup;
  private onDestroy$ = new Subject<void>();

  updateLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // this.latitude = resp.coords.latitude;
      // this.longitude = resp.coords.longitude;
      console.log(resp.coords.latitude, resp.coords.longitude);

      this.http.post(this.server, {
        name: this.name,
        phone: this.phone,
        registration: this.globalvars.registrationId,
        latitude: resp.coords.latitude,
        longitude: resp.coords.longitude,
        remove: false
      }).map(res => res.json()).subscribe((data) => {
        console.log('Location update successful', data);
      }, (error) => {
        console.log('Server error', error);
        try {
          this.popup.dismiss();
        } catch(e) {
          console.log("try-catch", e);
        }
        this.popup = this.alertCtrl.create({
          title: 'Server Error',
          message: 'Please try again',
          buttons: ['OK'],
          cssClass: 'alertCustomCss',
          enableBackdropDismiss: false
        });
        this.popup.present();
      });
    }).catch((error) => {
      console.log('Error in location', error);
      try {
        this.popup.dismiss();
      } catch(e) {
        console.log("try-catch", e);
      }
      this.popup = this.alertCtrl.create({
        title: 'Error',
        message: "Could not retrieve location. Please try again",
        buttons: ['Ok'],
        cssClass: 'alertCustomCss',
      });
      this.popup.present();
    });

    /* this.http.post(this.server, {
      name: this.name,
      phone: this.phone,
      latitude: this.latitude,
      longitude: this.longitude,
      remove: false
    }).map(res => res.json()).subscribe((data) => {
      console.log('Location update successful', data);
    }, (error) => {
      console.log('Server error', error);
      try {
        this.popup.dismiss();
      } catch(e) {
        console.log("try-catch", e);
      }
      this.popup = this.alertCtrl.create({
        title: 'Server Error',
        message: 'Please try again',
        buttons: ['OK'],
        cssClass: 'alertCustomCss',
        enableBackdropDismiss: false
      });
      this.popup.present();
    }); */
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
    else {
      this.name = data['name'];
      this.phone = Number(data['phone']);
      this.updateLocation();
      Observable.interval(1000 * 5).takeUntil(this.onDestroy$).subscribe(x => {
        this.updateLocation();
      });
    }
  }
}
