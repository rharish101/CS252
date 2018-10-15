import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { RocketsPage } from '../pages/rockets/rockets';

import { Geolocation } from '@ionic-native/geolocation';
import { MapPage } from '../pages/map/map';
import { CameraPage } from '../pages/camera/camera';

import { File } from '@ionic-native/file';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = RocketsPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private gl: Geolocation) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Rockets', component: RocketsPage},
      {title: 'Map', component: MapPage},
      {title: 'Camera', component: CameraPage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.show();
      this.splashScreen.hide();

      /**
       * Shows the current location coordinates. Plugins can be used once the platform is ready.
       */
      this.gl.getCurrentPosition()
      .then((res) => {
        console.log(res);
      })
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
