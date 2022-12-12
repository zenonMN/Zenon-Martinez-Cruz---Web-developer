import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { ScriptService } from './services/script.service';
import { LoginComponent } from './components/login/login.component';
import { ProviderService } from './services/providers.service';
import { ProfileService } from './services/profile.service';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DacoinmarketcapComponent } from './components/dacoinmarketcap/dacoinmarketcap.component';
import { BlankComponent } from './components/blank/blank.component';
import { AuthGuard, AuthGuardInit, AuthService } from './services/auth.service';
import { AccountsComponent } from './components/accounts/accounts.component';
import { PaymentmethodsComponent } from './components/paymentmethods/paymentmethods.component';
import { MarketService } from './services/market.service';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { DepositsComponent } from './components/deposits/deposits.component';
import { BuyandsellComponent } from './components/buyandsell/buyandsell.component';

const appRoutes: Routes = [
  {
    path: 'blank',
    component: BlankComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'coinmarket',
    component: DacoinmarketcapComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardInit],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    DashboardComponent,
    DacoinmarketcapComponent,
    BlankComponent,
    AccountsComponent,
    PaymentmethodsComponent,
    TransactionsComponent,
    DepositsComponent,
    BuyandsellComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
  ],
  providers: [
    ScriptService,
    ProviderService,
    ProfileService,
    AuthService,
    AuthGuard,
    AuthGuardInit,
    MarketService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
