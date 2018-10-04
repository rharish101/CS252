import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(private storage: Storage, public navCtrl: NavController) { }

  ionViewDidLoad() {
    this.storage.get('firsttime').then((val) => {
      if (val === null) {
        this.storage.set('firsttime', 'no');
        this.navCtrl.push('TutorialPage');
      }
    });
  }

  openPage(role: string) {
    if (role === "customer")
      this.navCtrl.push('CustomerPage');
    else if (role === "driver")
      this.navCtrl.push('DriverPage');
  }
}
