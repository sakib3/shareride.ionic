import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PickUpPage } from '../pages/pick-up/pick-up';
import { SharePostPage } from '../pages/share-post/share-post';
import { ViewShareRidesPage } from '../pages/view-share-rides/view-share-rides';
import { ProfilePage } from '../pages/profile/profile';
import { MapComponent } from '../pages/../components/map/map';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { User } from '../providers/user/user';
import { Api } from '../providers/api/api';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignUpPage,
    HomePage,
    PickUpPage,
    SharePostPage,
    ViewShareRidesPage,
    ProfilePage,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
    //IonicModule.forRoot(LoginPage)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignUpPage,
    HomePage,
    PickUpPage,
    ViewShareRidesPage,
    SharePostPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Diagnostic,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    User,
    Api,
    ViewShareRidesPage
  ]
})
export class AppModule {}
