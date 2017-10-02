import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-pick-up',
  templateUrl: 'pick-up.html',
})
export class PickUpPage {
  target= {fromActiveIcon:"md-radio-button-off",toActiveIcon:"md-radio-button-off"};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  focusFunction(key){
    console.log(key);
    this.target[key] = "md-radio-button-on";
  }
  focusOutFunction(key){
    this.target[key] = "md-radio-button-off";
  }
}

