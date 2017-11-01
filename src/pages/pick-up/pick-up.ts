import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var google;
var route= {source : '', destination: '', stopover:[]};
@Component({
  selector: 'page-pick-up',
  templateUrl: 'pick-up.html',
})
export class PickUpPage {
  target= {fromActiveIcon:"md-radio-button-off",toActiveIcon:"md-radio-button-off"};
  source:string = '';
  stopover:string;
  stopOverArray:Array<string> = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    ) {
  }

  addStopOver(){
    this.stopOverArray = this.stopOverArray.concat(this.stopover);
    document.getElementById('stopover').nodeValue = '';
  }
  ionViewDidLoad() {
    var self = this;
    if(this.navParams.get('source'))
      route.source = this.navParams.get('source');
    this.source = route.source;
    var destination = document.getElementById('destination');
    var autocompleteDestination = new google.maps.places.Autocomplete(destination);
    var source = document.getElementById('source');
    document.getElementById('source').nodeValue = route.source;
    var autocompleteSource = new google.maps.places.Autocomplete(source);
    var stopover = document.getElementById('stopover');
    var autocompleteStopover = new google.maps.places.Autocomplete(stopover);
    google.maps.event.addListener(autocompleteStopover, 'place_changed', function () {
      self.stopover = autocompleteStopover.getPlace().formatted_address;
      console.log(self.stopover);
    });
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
    var waypts = [];
    for (var i = 0; i < this.stopOverArray.length; i++)
    waypts.push({
      location: this.stopOverArray[i],
      stopover: true
    });
    route.stopover = waypts;
    this.viewCtrl.dismiss(route);
  }
}

