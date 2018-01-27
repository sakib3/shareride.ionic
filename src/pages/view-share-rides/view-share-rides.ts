import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Api } from '../../providers/api/api';

class PostRideModel {
  _id: any;
  name: string;
  from: string;
  destinationLocation: Array<any>;
  to: string;
  sourceLocation: Array<any>;
  stopover: Array<string>;
  shareType: string;
  journeyFrequency: string;
  daysOfTravel: Array<string>;
  journeyDate: string;
  returnDate: string;
  rate;
  availability: string;
  constructor() { }
}

@Component({
  selector: 'page-view-share-rides',
  templateUrl: 'view-share-rides.html',
})
export class ViewShareRidesPage {
  public models = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public api: Api, ) {
    //api.init();
  }

  ionViewDidLoad() {
    //while(!this.api.tokenIsSet()){};
    var self = this;
    self.api.setToken().then((token) => {
      alert(token);
      console.log('ionViewDidLoad ViewShareRidesPage');
      alert('ionViewDidLoad');
      self.api.get('api/postRides')
        .subscribe((res: any) => {
          alert(JSON.stringify(res));
          self.models = res;
          console.log(res)
        }, (err) => {
          // self.models = [{_id: '5a3544c71847cc05bf55ae48'}];
          console.log('error ', err._body)

        });
    })

  }
  closeModal() {
    this.viewCtrl.dismiss();
  }

}
