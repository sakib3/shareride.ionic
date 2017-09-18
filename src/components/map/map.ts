import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { LoadingController, NavController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform } from 'ionic-angular';
declare var google;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent implements OnInit {

  public map;
  constructor(
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public nav: NavController,
    private diagnostic: Diagnostic,
    public platform: Platform) {
  }

  ngOnInit() {
    this.platform.ready().then((readySource) => {
      this.map = this.createMap();
    });

  }
  renderCurrentLocation(){
    this.diagnostic.isLocationEnabled()
    .then((isAvailable) => {
      console.log('Is available? ' + isAvailable);
      if(isAvailable){
        this.render();
      }else{
        alert('Please Turn On Your GPS!');
      }
    })
    .catch((e) => {
      console.log(e);
      alert(JSON.stringify(e));
    });
  }
  render(){

    this.getCurrentLocation()
      .subscribe(location => {
        this.map = this.createMap(location);
    });
  }
  getCurrentLocation() {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();
    let locationObs = Observable.create(obserable => {
      this.geolocation.getCurrentPosition()
        .then((resp) => {
          var location = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
          //this.map =this.createMap(location);
          obserable.next(location);
          loading.dismiss();
        })
        .catch((error) => {
          console.log('Error getting location', error);
          loading.dismiss();
        });
    });
    return locationObs;
  }
  createMap(location = new google.maps.LatLng(40.712784, -74.005942)) {

    let mapOptions = {
      center: location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    let mapEl = document.getElementById("map");
    let map = new google.maps.Map(mapEl, mapOptions);

    return map;
  }

}
