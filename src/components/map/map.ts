import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { LoadingController, NavController, ModalController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform } from 'ionic-angular';
import { PickUpPage } from '../../pages/pick-up/pick-up';
declare var google;
var lastAddressFound = '';
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
        .then((readySource) => this.renderCurrentLocation());
  }

  renderCurrentLocation() {
    this.diagnostic.isLocationEnabled()
      .then((isAvailable) => {
        if (isAvailable)
          this.getCurrentLocation()
          .subscribe(location => {
            this.getAddress(location);
          });
        else
          alert('Please Turn On Your GPS!');
      })
      .catch((e) => alert(JSON.stringify(e)));
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

  getAddress(location: LatLng) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var geocoder = new google.maps.Geocoder;
    var latlng = { lat: location.latitude, lng: location.longitude };
    geocoder.geocode({ 'location': latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]){
          lastAddressFound = results[0].formatted_address;
          this.map = this.createMap(location, lastAddressFound,directionsDisplay);
        }
         else
          alert('No results found');
      } else
        alert('Geocoder failed due to: ' + status);
    });
  }


  createMap(latlng: LatLng, address = '', directionsDisplay = null) {
    lastAddressFound = address;
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
    if(directionsDisplay!=null)
      directionsDisplay.setMap(map);
    infowindow.setContent(address);
    infowindow.open(map, marker);
    return map;
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination) {
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  openModal() {
    const pickUpModal = this.modalCtrl.create(PickUpPage,{source: lastAddressFound});
    pickUpModal.onDidDismiss(data => {
      if(data)
        this.displayRoute(data);
    });
    pickUpModal.present();
  }


  displayRoute(routeData){
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    let mapOptions = {
      center: {lat: 41.85, lng: -87.65},
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    let mapEl = document.getElementById("map");
    let map = new google.maps.Map(mapEl, mapOptions);
    map.setOptions(this.getGoogleMapStyle());
    directionsDisplay.setMap(map);
    directionsDisplay.addListener('directions_changed', function() {
      document.getElementById('total').style.display = "block";
      var result = directionsDisplay.getDirections();
      var total = 0;
      var totalDuration = 0;
      var myroute = result.routes[0];
      for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
        totalDuration += myroute.legs[i].duration.value;
      }
      total = total / 1000;
      //totalDuration = this.secToHourMin(totalDuration);
      var secondsForMin = totalDuration%(3600);
      var hours = Math.floor(totalDuration/3600);
      var mins = Math.floor(secondsForMin/60);

      document.getElementById('totaldistance').innerHTML = total+ ' km';
      document.getElementById('totalduration').innerHTML = hours +' hours '+ mins + ' minutes';
      //this.computeTotalDistance(directionsDisplay.getDirections());
    });
    this.calculateAndDisplayRoute(directionsService, directionsDisplay,routeData.source,routeData.destination);


  }
  searchRide(){

  }
  secToHourMin(seconds){
    var secondsForMin = seconds%(3600);
    var hours = Math.floor(seconds/3600);
    var mins = Math.floor(secondsForMin/60);
    return hours +' hours '+ mins + ' minutes';
  }
  computeTotalDistance(result) {

    console.log(result);
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
    }
    total = total / 1000;
    var data = '<ion-icon name="leaf" item-start></ion-icon>'
    +total+
    '<ion-icon name="rose" item-end></ion-icon>';
    document.getElementById('total').innerHTML = data;
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
