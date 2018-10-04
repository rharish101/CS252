import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild(Slides) slides: Slides;

  constructor(private storage: Storage, public navCtrl: NavController) { }

  slidesVisible: boolean = false;

  ionViewDidEnter() {
    this.storage.get('firsttime').then((val) => {
      if (val === null) {
        this.slidesVisible = true;
        setTimeout(() => {
          this.slides.lockSwipeToPrev(true);
        }, 500);
        this.storage.set('firsttime', 'no');
      }
    });
  }

  slideChanged() {
    if (this.slides.isBeginning())
      this.slides.lockSwipeToPrev(true);
    else
      this.slides.lockSwipeToPrev(false);
    if (this.slides.isEnd())
      this.slidesVisible = false;
  }

  closeSlides() {
    this.slides.slideNext();
  }

  openPage(role: string) {
    if (role === "customer")
      this.navCtrl.push('CustomerPage');
    else if (role === "driver")
      this.navCtrl.push('DriverPage');
  }
}
