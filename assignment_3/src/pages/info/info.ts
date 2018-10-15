import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  rocket;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.rocket = this.navParams.get('rocket');
    console.log(this.rocket);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
  }

}
