import { Component} from '@angular/core';
import { App, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';
import { SignUpPage } from '../../pages/sign-up/sign-up';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public rootPage: any ;
  registerCredentials = { email: '', password: ''};
  loading: Loading;
  alert;
  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public appCtrl: App,
    public auth: AuthServiceProvider) {
  }

  public login(){
    this.showLoading();
    this.auth.login(this.registerCredentials)
      .subscribe(data => {
        if(data.token){
          this.navigatePage(HomePage);
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

  public createAccount() {
    this.navigatePage(SignUpPage);
    //this.showError('Not implemented!');
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
