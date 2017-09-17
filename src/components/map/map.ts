import { Component } from '@angular/core';

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {

  text: string;

  constructor() {
    this.text = 'Hello World';
  }

}
