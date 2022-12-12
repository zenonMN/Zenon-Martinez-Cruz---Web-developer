import { Component, OnInit } from '@angular/core';
import { Price } from 'src/app/models/price';
import { MarketService } from 'src/app/services/market.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public tab: number = 0;
  public accounts: any = [];
  public paymentMethods: any = [];
  public prices: string[] = [];
  public transactions: any = {};
  constructor(
    private profileService: ProfileService,
    private marketService: MarketService
  ) { 
    marketService.priceChange.subscribe(flag => {
      this.prices = Object.keys(this.marketService.getPrices());
    });
  }

  ngOnInit(): void {
  }

  getAccounts(event: any) {
    this.accounts = this.profileService.getActiveAccounts();
    console.log("event: ", event);
    this.tab = 1;
  }

  getAddresses(event: any) {
  
  }

  getPaymentMethods(event: any) {
    this.paymentMethods = this.profileService.getPaymentMethodsArray();
    console.log("event: ", event, this.paymentMethods);
    this.tab = 5;
  }

  chargeDashboard() {
    this.tab = 0
    this.prices = Object.keys(this.marketService.getPrices());
  }

  getCriptoName(cripto: string){
    return this.profileService.getCriptoBySymbol(cripto);
  }
  getBuyPrice(cripto: string) {
    const price = this.marketService.getBuyPriceBySymbol(cripto);
    return price ? price.amount : 0;
  }
  getSellPrice(cripto: string){
    const price = this.marketService.getSellPriceBysymbol(cripto);
    return price ? price.amount: 0;
  }
  getCryptoIcon(currency: string): string {
    let className: string =  "crypto-icon ";
    className += "icon-"+currency.toLowerCase();
    return className;
  }

  getTransactions(event: any) {
    this.accounts = this.profileService.getActiveAccounts();
    this.transactions = this.profileService.getAllTransactionsArray();
    this.tab = 6;
  }

  getInformationBeforePayOrSell(event: any) {
    this.tab = 3;
  }
}
