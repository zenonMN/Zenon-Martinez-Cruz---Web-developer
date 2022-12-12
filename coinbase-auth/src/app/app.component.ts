import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { MarketService } from './services/market.service';
import { ProfileService } from './services/profile.service';
import { ProviderService } from './services/providers.service';
import { ScriptService } from './services/script.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'coinbase';

  public coinMarketWidget: boolean = false;
  constructor(
    private scriptService: ScriptService,
    private authService: AuthService,
    private providerService: ProviderService,
    private profileService: ProfileService,
    private marketService: MarketService
  ) {
    //Request prices
    const defaultCriptos: string[] = environment.criptos.default;
    defaultCriptos.forEach((cripto: string) => {
      //Request market price
      this.marketService.getCriptoPrice(cripto);
    });
    //
    console.log("[auth] - isLoggedIn(): ", authService.isLoggedIn());
    if(authService.isLoggedIn()) {
      providerService.coinbaseGetUser(localStorage.getItem("id_token"));
      this.profileService.getAccounts();
      this.profileService.getPaymentMethods();
      
    } else if(localStorage.getItem("refresh_token")) {
      providerService.requestNewToken(localStorage.getItem("refresh_token"));
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //Home script load
    this.scriptService.load("HomeScript").then(data => {
      console.log('script loaded', data); 
    }).catch(error => console.log("Error al cargar scripts: ", error));  
  }

  openWidget(flag: boolean) {
    console.log("open widget: ", flag);
    this.coinMarketWidget = flag;
  }
}
