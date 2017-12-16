import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, RequestMethod, RequestOptionsArgs } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Api {
  url: string = "https://shareridebd.herokuapp.com";
  //url: string = "http://localhost:8000";
  token: string = null;
  constructor(public http: Http,
    private storage: Storage) {
    //this.init();
  }
  init() {
    var self = this;
    this.storage.get('token').then((val) => {
      console.log('Token set into api service', val);
      self.token = val;
    });
  }
  getHeaders(){
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', `Bearer ${this.token}`);
    // let headers = new Headers({ 'Authorization': 'Bearer ' + this.token });
    // return new RequestOptions({
    //   headers
    //   //headers: headers
    // });
    // return {
    //   headers: headers
    // };
    let headersx = new Headers();
    headersx.append('Content-Type', 'application/x-www-form-urlencoded');
    headersx.append('Accept', 'application/json');
    headersx.append('Authorization', 'Bearer ' + this.token);

    return { headers: headersx };
  }
  private _buildAuthHeader(): string {
    return 'Bearer ' + this.token;
  }
  get(endPoint: string, params?: any, reqOpts?: any) {
    console.log('Get with token: ', this.token);
    var url = this.url + '/' + endPoint;
    return this.http
      .get(url,this.getHeaders())
      .map(res => res.json());
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    console.log('Post with token: ', this.token);

    var url = this.url + '/' + endpoint;
    if(reqOpts)
    return this.http
    .post(url, body, reqOpts)
    .map(res => res.json());

    // console.log(JSON.stringify(this.getHeaders()));
    //  return this.http
    // .post(url, body, this.getHeaders())
    // .map(res => res.json());;
    return this._request(RequestMethod.Post, url, body);


    // return this.http
    //   .post(url, body, reqOpts)
    //   .map(res => res.json());
  }

  private _request(method: RequestMethod, url: string, body?: string, options?: RequestOptionsArgs){
    let requestOptions = new RequestOptions(Object.assign({
      method: method,
      url: url,
      body: body
    }, options));

    if (!requestOptions.headers) {
      requestOptions.headers = new Headers();
    }

    requestOptions.headers.append('Content-Type', 'application/json');

    requestOptions.headers.append("Authorization", this._buildAuthHeader())
    return this.http.request(new Request(requestOptions)).map(res=> res.json())
  }
}
