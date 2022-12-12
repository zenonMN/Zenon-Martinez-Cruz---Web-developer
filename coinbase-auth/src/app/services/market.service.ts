import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Price } from '../models/price';

@Injectable({
    providedIn: 'root',
  })
export class MarketService {
  prices: any = {
    BTC: {},
    LTC:{},
    ETH: {},
    BCH:{}
  };
  public priceChange: EventEmitter<any> = new EventEmitter<any>();
  constructor(private http: HttpClient) {}

  private getBuyPrice(currency: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'CB-VERSION': '2021-11-23',
    });
    this.http
      .get(environment.coinbase.api + `/v2/prices/${currency}-USD/buy`, {
        headers: headers,
      })
      .subscribe((res: any) => {
        console.log('Response: ', res);
        if (res.data) {
          this.prices[currency].buy = new Price(currency, res.data);
          this.priceChange.emit(true);
          console.log('[Prices] - prices', this.prices);
        } else {
          console.error('[API] - user data not found');
        }
      });
  }

  private getSellPrice(currency: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'CB-VERSION': '2021-11-23',
    });
    this.http
      .get(environment.coinbase.api + `/v2/prices/${currency}-USD/sell`, {
        headers: headers,
      })
      .subscribe((res: any) => {
        console.log('Response: ', res);
        if (res.data) {
          this.prices[currency].sell = new Price(currency, res.data);
          this.priceChange.emit(true);
          console.log('[Prices] - prices', this.prices);
        } else {
          console.error('[API] - user data not found');
        }
      });
  }

  private getSpotPrice(currency: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'CB-VERSION': '2021-11-23',
    });
    this.http
      .get(environment.coinbase.api + `/v2/prices/${currency}-USD/spot`, {
        headers: headers,
      })
      .subscribe((res: any) => {
        console.log('Response: ', res);
        if (res.data) {
          this.prices[currency].spot = new Price(currency, res.data);
          this.priceChange.emit(true);
          console.log('[Prices] - prices', this.prices);
        } else {
          console.error('[API] - user data not found');
        }
      });
  }

  getCriptoPrice(currency: string) {
    this.getBuyPrice(currency);
    this.getSellPrice(currency);
    this.getSpotPrice(currency);
  }

  getPrices(): Price[] {
    return this.prices;
  }

  getBuyPriceBySymbol(cripto: string): Price {
    return this.prices[cripto].buy;
  }

  getSellPriceBysymbol(cripto: string): Price {
    return this.prices[cripto].sell;
  }
}
