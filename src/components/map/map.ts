import { Component,OnInit } from '@angular/core';

declare var google;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent implements OnInit {

public map;
  constructor() {
  }

  ngOnInit(){
    this.map =this.createMap();
  }

  createMap(location = new google.maps.LatLng(40.712784,-74.005942)){

    let mapOptions = {
      center: location,
      zoom:15,
      mapTypeId:google.maps.MapTypeId.ROADMAP,
      disableDefaultUI:true
    }
    let mapEl = document.getElementById("map");
    let map = new google.maps.Map(mapEl,mapOptions);

    return map;
  }

}
