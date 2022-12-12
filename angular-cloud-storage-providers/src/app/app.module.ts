import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DriveComponent } from './components/drive/drive.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { Modal2Content, ModalContentComponent } from './components/modal/modal.component';
import { ProvidersService } from './services/providers.service';
import { ProfileService } from './services/profile.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MsalModule } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { BlankComponent } from './components/blank/blank.component';
import { ExampleComponent } from './components/example/example.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

const appRoutes: Routes = [
  {
    path: "drive",
    component: DriveComponent,
    // canActivate: [AuthGuardInit]
  },
  {
    path: "home",
    component: HomeComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: "blank", 
    component: BlankComponent
  },
  {
    path: "example",
    component: ExampleComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DriveComponent,
    HeaderComponent,
    ModalContentComponent,
    Modal2Content
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    CommonModule,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: '216c003b-7ff7-4ed6-9981-1c73add7bb82', // This is your client ID
        redirectUri: 'http://localhost:4200/home'// This is your redirect URI
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      }
    }), null, null)
  ],
  providers: [ProvidersService, ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
