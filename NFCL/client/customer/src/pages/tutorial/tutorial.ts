import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

/**
 * Generated class for the TutorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})

export class TutorialPage {
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidEnter() {
    console.log('ionViewDidEnter TutorialPage');
      setTimeout(() => {
        this.slides.lockSwipeToPrev(true);
      }, 500);
  }

  slideChanged() {
    if (this.slides.isBeginning())
      this.slides.lockSwipeToPrev(true);
    else
      this.slides.lockSwipeToPrev(false);
    if (this.slides.isEnd())
      this.slides.lockSwipeToNext(true);
    else
      this.slides.lockSwipeToNext(false);
  }

  closeSlides() {
    this.navCtrl.popToRoot({animate: true, direction: 'forward'});
  }
}
