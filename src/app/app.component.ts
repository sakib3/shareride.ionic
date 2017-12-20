import { Component , ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ModalController } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ViewShareRidesPage } from '../pages/view-share-rides/view-share-rides';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any = HomePage;
  rootPage:any = LoginPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    //{ title: 'Home', component: 'HomePage' }
    { title: 'ViewShareRidesPage', icon:'md-share', component: ViewShareRidesPage }
  ]

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public modalCtrl: ModalController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page){
    //console.log(page);
    let modal = this.modalCtrl.create(page.component, { userId: 8675309 });
    modal.present();
    //this.nav.setRoot(page.component);
  }
  openModal(){
    let obj = {userId: '1', name: 'Bob', email: 'bob@unicorn.com'};
    let myModal = this.modalCtrl.create(ViewShareRidesPage, obj);
    myModal.present();
  }
}

