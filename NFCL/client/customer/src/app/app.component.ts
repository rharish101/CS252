import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { HomePage } from '../pages/home/home';
import { GlobalVarsService } from '../services/globalvars/globalvars';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(private screenOrientation: ScreenOrientation, public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public globalvars: GlobalVarsService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.overlaysWebView(true);
      statusBar.styleBlackTranslucent();
      screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);
      splashScreen.hide();
    });
  }
}

