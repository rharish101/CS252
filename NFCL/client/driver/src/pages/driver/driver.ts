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
import { MyApp } from '../../app/app.component'
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

  private server: string = "https://nfcl.pythonanywhere.com/api/"
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

    const options: PushOptions = {
      android: {
        senderID: this.globalvars.registrationId,
        icon: 'cab',
        iconColor: '#FEC33A'
      }
    };
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification) => {
      console.log('Received notification', notification);
      if (notification.additionalData.foreground) {
        this.showPopup({
          title: 'Info',
          message: 'You may be contacted by a customer',
          buttons: ['Ok'],
          cssClass: 'alertCustomCss',
        });
      }
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
    let phone_regex = new RegExp(String.raw`^((\+|00)(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1))?\d{4,20}$`);
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
