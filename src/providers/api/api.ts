import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Api {
  //url: string = "https://shareridebd.herokuapp.com/api";
  url: string = "http://localhost:8000";
  constructor(public http: Http) {
  }

  get(endPoint: string, params?: any, reqOpts?:any){
    return this.http.get(this.url + '/' + endPoint).map(res => res.json());
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts).map(res => res.json());
  }
}
