import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(public navCtrl: NavController) { }

  openPage(role: string) {
    if (role === "customer")
      this.navCtrl.push('CustomerPage');
    else if (role === "driver")
      this.navCtrl.push('DriverPage');
  }
}
