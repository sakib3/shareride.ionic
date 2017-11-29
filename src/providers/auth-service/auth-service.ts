import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

export class User{
  name: string;
  password: string;
  constructor(name:string, password:string) {
    this.name = name;
    this.password = password;
  }
}

@Injectable()
export class AuthServiceProvider {
  currentUser:User;

  public login(credentials) {
    if(credentials.name === null || credentials.password === null)
      return Observable.throw("Please insert credentials");
    else
      return Observable.create(observer => {
        //check in backend
        let access = (credentials.name === "user" || credentials.password === "password");
        this.currentUser = new User("user","password")
        observer.next(access);
        observer.complete();
      });
  }

  public register(credentials) {
    if(credentials.name === null || credentials.password === null)
      return Observable.throw("Please insert credentials");
    else
      return Observable.create(observer => {
        //store to db
        observer.next(true);
        observer.complete();
      });
  }

  public getUser() {
    return this.currentUser;
  }

  public logout() {
      return Observable.create(observer => {
        this.currentUser = null;
        observer.next(true);
        observer.complete();
      });
  }

}
