import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var google;
var route= {source : '', destination: ''};
@Component({
  selector: 'page-pick-up',
  templateUrl: 'pick-up.html',
})
export class PickUpPage {
  target= {fromActiveIcon:"md-radio-button-off",toActiveIcon:"md-radio-button-off"};
  source:string = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    ) {
  }

  ionViewDidLoad() {
    if(this.navParams.get('source'))
      route.source = this.navParams.get('source');
    this.source = route.source;
    var destination = document.getElementById('destination');
    var autocompleteDestination = new google.maps.places.Autocomplete(destination);
    var source = document.getElementById('source');
    document.getElementById('source').nodeValue = route.source;
    var autocompleteSource = new google.maps.places.Autocomplete(source);
    google.maps.event.addListener(autocompleteDestination, 'place_changed', function () {
      route.destination = autocompleteDestination.getPlace().formatted_address;
    });
    google.maps.event.addListener(autocompleteSource, 'place_changed', function () {
      route.source = autocompleteSource.getPlace().formatted_address;
    });
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
  onSubmit() {
    this.viewCtrl.dismiss(route);
  }
}

