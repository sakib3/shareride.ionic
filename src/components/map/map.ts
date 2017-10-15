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
  showSearchRideButton: boolean;
  lastRoute: any;
  routeObject: any;
  public map;
  constructor(
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public nav: NavController,
    private diagnostic: Diagnostic,
    private modalCtrl: ModalController,
    public platform: Platform) {
    this.showSearchRideButton = false;
  }

  ngOnInit() {
    // this.platform.ready()
    //   .then((readySource) => this.renderCurrentLocation());
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
        if (results[0]) {
          lastAddressFound = results[0].formatted_address;
          this.map = this.createMap(location, lastAddressFound, directionsDisplay);
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
    //let mapOptions = this.getMapOptions();
    let mapEl = document.getElementById("map");
    let map = new google.maps.Map(mapEl, mapOptions);
    map.setOptions(this.getGoogleMapStyle());
    var marker = new google.maps.Marker({
      position: location,
      icon: 'https://png.icons8.com/map-pin/win10/64',
      map: map,
    });
    if (directionsDisplay != null)
      directionsDisplay.setMap(map);
    infowindow.setContent(address);
    infowindow.open(map, marker);
    return map;
  }

  openModal() {
    const pickUpModal = this.modalCtrl.create(PickUpPage, { source: lastAddressFound });
    pickUpModal.onDidDismiss(data => {
      if (data)
        this.displayRoute(data);
      else
        this.showSearchRideButton = true;
    });
    this.showSearchRideButton = false;
    pickUpModal.present();
  }

  getMapOptions(): any {
    return {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      scaleControl: true,
      disableDefaultUI: true
    };
  }

  setMap(){
    let mapOptions = this.getMapOptions();
    let mapEl = document.getElementById("map");
    let map = new google.maps.Map(mapEl, mapOptions);
    map.setOptions(this.getGoogleMapStyle());
    this.map = map;
  }

  displayRoute(routeData) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    this.setMap();
    directionsDisplay.setMap(this.map);
    var self = this;
    //this.diplayTotalDistanceTime(directionsDisplay.getDirections())
    directionsDisplay.addListener(
      'directions_changed',
      () => self.diplayTotalDistanceTime(directionsDisplay.getDirections())
    );
    this.calculateAndDisplayRoute(directionsService, directionsDisplay, routeData.source, routeData.destination);
    this.do(routeData.source, routeData.destination);
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination) {
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING',
      optimizeWaypoints: true,
      //stopover: true
    }, function (response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

 diplayTotalDistanceTime(result){
  var totalDistance = 0;
  var totalDuration = 0;
  var myroute = result.routes[0];
  var that = this;
  this.routeObject = myroute;
  for (var i = 0; i < myroute.legs.length; i++) {
    totalDistance += myroute.legs[i].distance.value;
    totalDuration += myroute.legs[i].duration.value;
  }
  this.routeObject.legs[0].steps.forEach(point => {
    that.addMarker(point.start_location);
  });
  var data = that.getTotal(totalDistance, totalDuration);
  that.pushDatatoDom(data);
 }

  pushDatatoDom(data) {
    document.getElementById('total').style.display = "block";
    document.getElementById('totaldistance').innerHTML = data.totaldistance + ' km';
    document.getElementById('totalduration').innerHTML = data.totalduration.hours + ' hours ' + data.totalduration.mins + ' minutes';
    this.showSearchRideButton = true;
  }

  getTotal(distanceInMeters, totalTimeInSeconds): any {
    var totaldistance = distanceInMeters / 1000;
    var secondsForMin = totalTimeInSeconds % (3600);
    var hours = Math.floor(totalTimeInSeconds / 3600);
    var mins = Math.floor(totalTimeInSeconds / 60);
    return {
      'totaldistance': totaldistance,
      'totalduration': { 'hours': hours, 'mins': mins }
    };
  }

  searchRide() {
    console.log(this.routeObject);
  }


  do(origin, destination) {

       var service = new google.maps.DistanceMatrixService;
       service.getDistanceMatrix({
         origins: [origin],
         destinations: [destination],
         travelMode: 'DRIVING',
         unitSystem: google.maps.UnitSystem.METRIC,
         avoidHighways: false,
         avoidTolls: false,
       }, function (response, status) {
         if (status !== 'OK') {
           alert('Error was: ' + status);
         } else {

           console.log(response);
           var geocoder = new google.maps.Geocoder;
         }

       });
    }
  // searchRide() {

    // var that = this;
    // var i = 0;
    // this.routeObject.legs[0].steps.forEach(point => {
    //   that.addMarker(point.start_location, point.instructions);
    //   // console.log(point.start_location)
    // });
    // console.log(this.routeObject);

  //   var that = this;
  //   var polygon = this.getPolygon();
  //   polygon.forEach((point) => {
  //     console.log(point)
  //     new google.maps.Marker({
  //       position: point,
  //       map: this.map,
  //       label: "------"
  //     })
  //   });
  // }

  getPolygon() {
    var route = this.routeObject;
    var lat1 = route.legs[0].start_location.lat();
    var lon1 = route.legs[0].start_location.lng();
    var lat2 = route.legs[route.legs.length - 1].end_location.lat();
    var lon2 = route.legs[route.legs.length - 1].end_location.lng();
    var polygon = [];
    console.log(lat1 - 2)
    console.log(lat1)
    console.log(lat1 - 2.0)
    polygon = polygon.concat(this.getLatLng2(Math.floor(lat1), lon1));
    // polygon = polygon.concat( this.getLatLng2(lat1+2, lon1+2));
    // polygon = polygon.concat( this.getLatLng2(lat2-2, lon2-2));
    // polygon = polygon.concat( this.getLatLng2(lat2+2, lon2+2));
    return polygon;
  }
  getLatLng2(lat, lon) {
    return new google.maps.LatLng(lat, lon);
  }
  //var route = this.lastRoute;

  // var lat1 = route.legs[0].start_location.lat();
  // var lon1 = route.legs[0].start_location.lng();
  // var lat2 = route.legs[route.legs.length-1].start_location.lat();
  // var lon2 = route.legs[route.legs.length-1].start_location.lng();
  // //var location = new google.maps.LatLng(latlng.latitude, latlng.longitude);
  // for(let i=0;i<1;i++){
  //   //var randomLocation = this.getRandomPositionFromLatLon(lat1, lon1, lat2, lon2);


  //   this.addMarker(new google.maps.LatLng(lat1, lon1), 'xxxx');
  //   this.addMarker(new google.maps.LatLng(lat2, lon2), 'YYYY',);
  // }
  // getRandomPositionFromLatLon(lat1, lon1, lat2, lon2){
  //   var lat = this.randomFloatFromInterval(lat1, lat2);
  //   var lon = this.randomFloatFromInterval(lon1, lon2);
  //   return new google.maps.LatLng(lat, lon);
  // }
  // randomFloatFromInterval(min, max) {
  //   var copymin = min;
  //   if (min > max) {
  //     min = max;
  //     max = copymin;
  //   }
  //   return (Math.random() * (max - min + 1) + min);
  // }
  addMarker(location, label = "") {
    var that = this;
    new google.maps.Marker({
      position: location,
      map: that.map,
      //label:label,
    });
    // let map = new google.maps.Map(document.getElementById('map'), {
    //   center:location
    // });

    // var marker = new google.maps.Marker({
    //   position: location,
    //   map: map,
    // });
    // this.map = map;
  }
  secToHourMin(seconds) {
    var secondsForMin = seconds % (3600);
    var hours = Math.floor(seconds / 3600);
    var mins = Math.floor(secondsForMin / 60);
    return hours + ' hours ' + mins + ' minutes';
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
      + total +
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
