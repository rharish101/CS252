import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RocketService } from './rockets.service';
import { InfoPage } from '../info/info';

/**
 * Generated class for the RocketsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rockets',
  templateUrl: 'rockets.html',
  providers: [RocketService]
})
export class RocketsPage {

  rockets: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private rocketsService: RocketService) {
    this.rocketsService.getData()
    .subscribe((data) => {
      this.rockets = data;
      console.log(this.rockets);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RocketsPage');
  }

  showInfo(rocket){
    this.navCtrl.push(InfoPage, {'rocket': rocket})
  }
}
