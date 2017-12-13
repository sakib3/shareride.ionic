import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private storage: Storage) {

  }

  ngOnInit() {
    this.storage.get('token').then((val) => {
      console.log('Your token is', val);
    });
  }

  logOut() {
    this.storage.remove('token').then(()=>{
      console.log('Storage is clear');
      this.navCtrl.setRoot(LoginPage);
    });

  }
}
