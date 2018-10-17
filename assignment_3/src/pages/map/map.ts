import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import 'leaflet';
import { Geolocation } from '@ionic-native/geolocation';
import L from 'leaflet';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  loading;
  constructor(private loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, private gl: Geolocation) {
    /**
     * Map takes a bit to load once the page is opened.
     * So we show a loading spinner to the user until the map is completely loaded.
     * We use Ionic's loading controller. Link: https://ionicframework.com/docs/api/components/loading/LoadingController/
     */
    this.presentLoading();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');

    var map  = L.map("map").fitWorld();

    /**
     * Apparently you don't need any tokens to use the maps.
     */
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'www.tphangout.com',
      maxZoom: 18
    }).addTo(map);

    map.locate({
      setView: true,
      maxZoom: 18
    })
    .on('locationfound', (e: any) => {
      console.log('Locationfound', e);
      L.marker([e.latitude, e.longitude]).addTo(map);
      this.loading.dismiss(); //Stop showing the loading spinner once the map is loaded.
    })
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading map...'
    });

    this.loading.present();
  }
}
