import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
declare var google;
@Component({
  selector: 'page-pick-up',
  templateUrl: 'pick-up.html',
})
export class PickUpPage {
  target= {fromActiveIcon:"md-radio-button-off",toActiveIcon:"md-radio-button-off"};
  from = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.from = this.navParams.get('from');
    console.log('ionViewDidLoad SearchPage');
    var destination = document.getElementById('destination');
    var autocompleteDestination = new google.maps.places.Autocomplete(destination);
    var source = document.getElementById('source');
    var autocompleteSource = new google.maps.places.Autocomplete(source);
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

