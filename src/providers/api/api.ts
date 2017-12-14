import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Api {
  //url: string = "https://shareridebd.herokuapp.com/api";
  url: string = "http://localhost:8000";
  token: string = null;
  constructor(public http: Http,private storage: Storage) {
    //this.init();
  }
  init() {
    var self = this;
    this.storage.get('token').then((val) => {
      console.log('Token set into api service', val);
      self.token = val;
    });
  }
  get(endPoint: string, params?: any, reqOpts?:any){
    console.log('Get with token: ', this.token);
    return this.http.get(this.url + '/' + endPoint).map(res => res.json());
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    console.log('Post with token: ', this.token);
    return this.http.post(this.url + '/' + endpoint, body, reqOpts).map(res => res.json());
  }
}
