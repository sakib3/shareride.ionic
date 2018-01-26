import { Component} from '@angular/core';
import { App, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  public rootPage: any ;
  registerCredentials = { countrycode:null, phone: null, name:'', email: '', password: '', gender:null};
  loading: Loading;
  alert;
  public gender;
  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public appCtrl: App,
    public auth: AuthServiceProvider,
    private storage: Storage) {
  }

  public selectGender($event, item){
    this.gender = item;
  }
  public signup(){
    this.showLoading();
    this.auth.signup(this.registerCredentials)
      .subscribe(data => {
        if(data.token){
          this.storage.set('token', data.token)
          .then(
            () =>this.navigatePage(HomePage),
            (e)=> console.log(e)
          );
        }
        else{
          this.loading.dismiss();
          this.showError('Access Denied');
        }
      },(err) => {
        this.loading.dismiss();
        this.showError('Error occured');
        console.log(err);
      });
  }

  navigatePage(Page){
    var root  =this.appCtrl.getRootNav();
    root.popToRoot();
    root.setRoot(Page);
  }

  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text){
    this.alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    this.alert.present();
  }

}
