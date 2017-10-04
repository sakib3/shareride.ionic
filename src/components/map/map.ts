import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { LoadingController, NavController, ModalController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform } from 'ionic-angular';
import { PickUpPage } from '../../pages/pick-up/pick-up';
declare var google;
class LatLng {
  latitude: number;
  longitude: number;
  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
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
    private modalCtrl: ModalController,
    public platform: Platform) {
  }

  ngOnInit() {
    this.platform.ready()
      .then((readySource) => this.map = this.createMap());
  }
  openModal() {
    const pickUpModal = this.modalCtrl.create(PickUpPage);
    pickUpModal.present();
  }
  renderCurrentLocation() {
    this.diagnostic.isLocationEnabled()
      .then((isAvailable) => {
        if (isAvailable)
          this.render();
        else
          alert('Please Turn On Your GPS!');
      })
      .catch((e) => alert(JSON.stringify(e)));
  }
  render() {
    this.getCurrentLocation()
      .subscribe(location => {
        this.getAddress(location);
      });
  }
  getAddress(location: LatLng) {
    var geocoder = new google.maps.Geocoder;
    var latlng = { lat: location.latitude, lng: location.longitude };
    geocoder.geocode({ 'location': latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0])
          this.map = this.createMap(location, results[0].formatted_address);
         else
          alert('No results found');
      } else
        alert('Geocoder failed due to: ' + status);
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
          var location = new LatLng(resp.coords.latitude, resp.coords.longitude);
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
  createMap(latlng = new LatLng(40.712784, -74.005942), address = '') {
    var infowindow = new google.maps.InfoWindow;
    var location = new google.maps.LatLng(latlng.latitude, latlng.longitude);
    let mapOptions = {
      center: location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    let mapEl = document.getElementById("map");
    let map = new google.maps.Map(mapEl, mapOptions);
    map.setOptions(this.getGoogleMapStyle());
    var marker = new google.maps.Marker({
      position: location,
      icon: 'https://png.icons8.com/map-pin/win10/64',
      map: map,
    });
    infowindow.setContent(address);
    infowindow.open(map, marker);
    return map;
  }

  getGoogleMapStyle() {
    return {
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#c9b2a6' }]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#dcd2be' }]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#ae9e90' }]
        },
        {
          featureType: 'landscape.natural',
          elementType: 'geometry',
          stylers: [{ color: '#dfd2ae' }]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{ color: '#dfd2ae' }]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#93817c' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry.fill',
          stylers: [{ color: '#a5b076' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#447530' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#f5f1e6' }]
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [{ color: '#fdfcf8' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#f8c967' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#e9bc62' }]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry',
          stylers: [{ color: '#e98d58' }]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#db8555' }]
        },
        {
          featureType: 'road.local',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#806b63' }]
        },
        {
          featureType: 'transit.line',
          elementType: 'geometry',
          stylers: [{ color: '#dfd2ae' }]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#8f7d77' }]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#ebe3cd' }]
        },
        {
          featureType: 'transit.station',
          elementType: 'geometry',
          stylers: [{ color: '#dfd2ae' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{ color: '#b9d3c2' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#92998d' }]
        }
      ]
    };
  }

}
