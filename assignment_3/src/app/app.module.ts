import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RocketsPage } from '../pages/rockets/rockets';


import { HttpClientModule } from '@angular/common/http';
import { HTTPService } from './httpservice.service';
import { InfoPage } from '../pages/info/info';

import { Geolocation } from '@ionic-native/geolocation';
import { MapPage } from '../pages/map/map';
import { Camera}  from '@ionic-native/camera';
import { CameraPage } from '../pages/camera/camera';

import { File } from '@ionic-native/file';
@NgModule({
  declarations: [
    MyApp,
    RocketsPage,
    InfoPage,
    MapPage,
    CameraPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RocketsPage,
    InfoPage,
    MapPage,
    CameraPage
  ],
  providers: [
    File,
    Camera,
    Geolocation,
    HTTPService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
